const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const { logging } = require('@google-cloud/logging');
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';
const request = require('request-promise-native');

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain 'err'
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME }
    }
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function'
    },
    context
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]
// [START chargecustomer]
// Charge the Stripe customer whenever an amount is created in Cloud Firestore
exports.createStripeCharge = functions.firestore
  .document('stripe_customers/{userId}/charges/{id}')
  .onCreate(async (snap, context) => {
    const val = snap.data();
    try {
      // Look up the Stripe customer id written in createStripeCustomer
      const snapshot = await admin
        .firestore()
        .collection('stripe_customers')
        .doc(context.params.userId)
        .get();
      const snapval = snapshot.data();
      const customer = snapval.customer_id;
      // Create a charge using the pushId as the idempotency key
      // protecting against double charges
      const {
        amount,
        destination,
        sender,
        destinationUid
      } = val;
      const idempotencyKey = context.params.id;
      const charge = {
        amount,
        currency,
        customer,
        'transfer_data[destination]': destination,
        application_fee_amount: 500
      };
      if (val.source !== null) {
        charge.source = val.source;
      }
      const response = await stripe.charges.create(charge, {
        idempotencyKey
      });

      // add charge to Musician list
      response.sender = sender;
      await admin
        .firestore()
        .collection('stripe_accounts/' + destinationUid + '/payments')
        .add(response);

      // If the result is successful, write it back to the database
      return snap.ref.set(response, { merge: true });
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      console.log(error);
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      return reportError(error, { user: context.params.userId });
    }
  });
// [END chargecustomer]]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(async user => {
  const customer = await stripe.customers.create({ email: user.email });
  return admin
    .firestore()
    .collection('stripe_customers')
    .doc(user.uid)
    .set({ customer_id: customer.id });
});

// Add a payment source (card) for a user by writing a stripe payment source token to Cloud Firestore
exports.addPaymentSource = functions.firestore
  .document('/stripe_customers/{userId}/tokens/{pushId}')
  .onCreate(async (snap, context) => {
    const source = snap.data();
    const { token } = source;
    if (source === null) {
      return null;
    }

    try {
      const snapshot = await admin
        .firestore()
        .collection('stripe_customers')
        .doc(context.params.userId)
        .get();
      const customer = snapshot.data().customer_id;
      const response = await stripe.customers.createSource(customer, {
        source: token
      });
      return admin
        .firestore()
        .collection('stripe_customers')
        .doc(context.params.userId)
        .collection('sources')
        .doc(response.fingerprint)
        .set(response, { merge: true });
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      return reportError(error, { user: context.params.userId });
    }
  });

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(async user => {
  const snapshot = await admin
    .firestore()
    .collection('tripe_customers')
    .doc(user.uid)
    .get();
  const customer = snapshot.data();
  await stripe.customers.del(customer.customer_id);
  return admin
    .firestore()
    .collection('stripe_customers')
    .doc(user.uid)
    .delete();
});

exports.stripeCallback = functions.https.onRequest(async (req, res) => {
  const userUid = req.query.state;
  const snapshot = await admin
    .firestore()
    .collection('users')
    .doc(userUid)
    .get();
  const user = snapshot.data();
  if (user === null) {
    console.log('User not exists');
    res.redirect(303, functions.config().general.app_domain + '/error');
  }
  const expressAuthorized = await request.post({
    uri: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: 'authorization_code',
      client_id: functions.config().stripe.client_id,
      client_secret: functions.config().stripe.secret_key,
      code: req.query.code
    },
    json: true
  });

  if (expressAuthorized.error) {
    throw (expressAuthorized.error);
  }

  // Update user document with Stripe account ID:
  const stripeAccountId = expressAuthorized.stripe_user_id;
  await admin
    .firestore()
    .collection('users')
    .doc(userUid)
    .set({ stripe_account_id: stripeAccountId }, { merge: true });

  // Create a new document with Stripe data:
  await admin
    .firestore()
    .collection('stripe_accounts')
    .doc(userUid)
    .set({ status: 'done', stripe_account_id: stripeAccountId });

  res.redirect(303, functions.config().general.app_domain + '/settings');
});

// Generate Stripe Account data like balance, login link etc. Event runs when status=in_progress
exports.generateStripeAccountData = functions.firestore
  .document('/stripe_accounts/{userId}')
  .onUpdate(async (change, context) => {
    const afterChangeUserData = change.after.data();

    if (afterChangeUserData.status === 'in_progress' && afterChangeUserData.stripe_account_id) {
      try {
        const stripeAccountId = afterChangeUserData.stripe_account_id;
        // Generate a unique login link for the associated Stripe account to access their Express dashboard
        const loginLink = await stripe.accounts.createLoginLink(
          stripeAccountId, {
            redirect_url: functions.config().general.app_domain + '/settings'
          }
        );
        const balance = await stripe.balance.retrieve({
          stripeAccount: stripeAccountId,
        });
        const accountStripeData = {
          login_link: loginLink.url,
          status: 'done',
          balanceAvailable: balance.available[0].amount,
          balancePending: balance.pending[0].amount,
          stripe_account_id: stripeAccountId
        };
        return admin
          .firestore()
          .collection('stripe_accounts')
          .doc(context.params.userId)
          .set(accountStripeData, { merge: true });
      } catch (err) {
        console.log(err);
      }
    }
    return null;
  });

// Add payout to stripe
exports.addPayout = functions.firestore
  .document('/stripe_accounts/{userId}/payouts/{payoutId}')
  .onCreate(async (snap, context) => {
    const payout = snap.data();
    if (payout === null) {
      return null;
    }
    const { stripe_account_id } = payout; // eslint-disable-line
    try {
      // Fetch the account balance to determine the available funds
      const balance = await stripe.balance.retrieve({
        stripe_account: stripe_account_id,
      });
      // This demo app only uses USD so we'll just use the first available balance
      // (Note: there is one balance for each currency used in your application)
      const { amount, currency } = balance.available[0];
      // Create an instant payout
      const payout = await stripe.payouts.create(
        {
          amount,
          currency
        },
        {
          stripe_account: stripe_account_id,
        }
      );
      console.log('payout :', payout);
      return admin
        .firestore()
        .collection('stripe_accounts/' + context.params.userId + '/payouts')
        .doc(context.params.payoutId)
        .set({ status: 'paid', amount, currency, created: new Date() }, { merge: true });
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      return reportError(error, { user: context.params.userId });
    }
  });
