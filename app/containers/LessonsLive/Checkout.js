import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  PapperBlock,
  CheckoutCardForm,
  CheckoutSavedCardList
} from 'enl-components';
import Button from '@material-ui/core/Button';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
// import { stripePromise } from '../../stripe';
import { loadStripe } from '@stripe/stripe-js';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

import {
  addNewCardRequest
} from 'enl-redux/actions/checkoutActions';
import { firebaseFirestoreDb } from '../../firebase';

const stripePromise = loadStripe('pk_test_QwN9lqvrCpimt6ga0lnKxD0700uF5AF1ms');


const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class LessonsLiveCheckout extends React.Component {
  state = {
    paymentCard: '',
    loading: false,
    openSnackBar: false,
    notificationMessage: ''
  }

  constructor(props) {
    super(props);
    this.setPaymentCard = this.setPaymentCard.bind(this);
    this.showAddNewCard = this.showAddNewCard.bind(this);
  }

  setPaymentCard(paymentCard) {
    this.setState({ paymentCard });
  }

  checkoutPayment = () => {
    const _this = this;
    const {
      currentUser
    } = this.props;
    const {
      paymentCard
    } = this.state;
    this.setState({ loading: true });

    firebaseFirestoreDb.collection('stripe_customers/' + currentUser.uid + '/charges').add({
      amount: 100,
      source: paymentCard
    }).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      firebaseFirestoreDb.collection('stripe_customers/' + currentUser.uid + '/charges').doc(docRef.id)
        .onSnapshot((doc) => {
          const charge = doc.data();
          if (charge.status) {
            _this.setState({
              loading: false,
              openSnackBar: true,
              notificationMessage: 'Payment successful!',
            });
          }
        });
    });
  }

  showAddNewCard = () => {
    const { addNewCardRequestFn } = this.props;
    addNewCardRequestFn();
  }

  handleRequestCloseSnackBar = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  render() {
    const {
      currentUser,
      classes,
      openCardForm
    } = this.props;
    const {
      loading,
      paymentCard,
      openSnackBar,
      notificationMessage
    } = this.state;

    return (
      <div>
        <PapperBlock title="Checkout" desc="Checkout page">
          <div>
            Checkout
          </div>
          <CheckoutSavedCardList user={currentUser} changePayment={this.setPaymentCard} />
          <Button variant="contained" color="secondary" className={classes.button} disabled={loading || !paymentCard} onClick={this.checkoutPayment}>
            Pay
          </Button>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          <Button variant="contained" color="secondary" className={classes.button} disabled={loading} onClick={this.showAddNewCard}>
            Add new card
          </Button>

          <div>
            {openCardForm && (
              <Elements stripe={stripePromise}>
                <ElementsConsumer>
                  {({ stripe, elements }) => (
                    <CheckoutCardForm stripe={stripe} elements={elements} user={currentUser} />
                  )}
                </ElementsConsumer>

              </Elements>
            )}
          </div>
        </PapperBlock>
        <Snackbar
          open={openSnackBar}
          message={notificationMessage}
          autoHideDuration={4000}
          onClose={this.handleRequestCloseSnackBar}
        />
      </div>
    );
  }
}

LessonsLiveCheckout.defaultProps = {
  openCardForm: false
};
LessonsLiveCheckout.propTypes = {
  currentUser: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  addNewCardRequestFn: PropTypes.func.isRequired
};

const reducerProfile = 'profileReducer';
const reducerCheckout = 'checkoutReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  openCardForm: state.get(reducerCheckout).openCardForm,
  ...state,
});

const mapDispatchToProps = {
  addNewCardRequestFn: addNewCardRequest,
};


const LessonsLiveCheckoutMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonsLiveCheckout);

export default withStyles(styles)(LessonsLiveCheckoutMapped);
