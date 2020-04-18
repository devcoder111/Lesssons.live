import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardElement } from '@stripe/react-stripe-js';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import {
  addNewCard
} from 'enl-redux/actions/checkoutActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { firebaseFirestoreDb } from '../../firebase';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing(3),
    width: 500
  }),
  buttonProgress: {
    marginTop: 20
  }
});

class CheckoutCardForm extends React.Component {
  _isMounted = false;

  state = {
    loading: false,
    openSnackBar: false,
    notificationMessage: ''
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    const {
      stripe, elements, user, addNewCardFn
    } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    const { token } = await stripe.createToken(cardElement);
    if (typeof token === 'undefined') {
      this.setState({
        openSnackBar: true,
        notificationMessage: 'Wrong card number.',
      });
    } else {
      this._isMounted = true;
      this.setState({ loading: true });
      const _this = this;
      firebaseFirestoreDb.collection('stripe_customers/' + user.uid + '/tokens').add({
        token: token.id
      }).then(() => {
        firebaseFirestoreDb.collection('stripe_customers/' + user.uid + '/sources')
          .onSnapshot((querySnapshot) => {
            const sources = [];
            if (querySnapshot.docs.length > 0) {
              querySnapshot.forEach((doc) => {
                sources.push(doc.data());
              });
            }
            if (sources.length > 0) {
              addNewCardFn(sources);
              if (_this._isMounted) {
                _this.setState({ loading: false });
              }
            }
          });
      });
    }
  }

  handleRequestCloseSnackBar = () => {
    this.setState({ openSnackBar: false });
  }

  render() {
    const { classes } = this.props;
    const { loading, openSnackBar, notificationMessage } = this.state;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>

          <form onSubmit={this.handleSubmit}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />

            <Button type="submit" variant="contained" size="small" color="primary" className={classes.buttonProgress} disabled={loading}>
              Add new card
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </form>
        </Paper>
        <Snackbar
          open={openSnackBar}
          message={notificationMessage}
          autoHideDuration={2000}
          onClose={this.handleRequestCloseSnackBar}
        />
      </div>
    );
  }
}

CheckoutCardForm.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addNewCardFn: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  addNewCardFn: addNewCard,
};

const reducerCheckout = 'checkoutReducer';
const mapStateToProps = state => ({
  cards: state.get(reducerCheckout).cards,
  ...state,
});
const CheckoutCardFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutCardForm);

export default withStyles(styles)(CheckoutCardFormMapped);
