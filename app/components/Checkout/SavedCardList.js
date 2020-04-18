import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { withStyles } from '@material-ui/core/styles';
import { firebaseFirestoreDb } from '../../firebase';

const styles = theme => ({
  demo: {
    height: 'auto',
  },
  divider: {
    display: 'block',
    margin: `${theme.spacing(3)}px 0`,
  },
  field: {
    margin: `${theme.spacing(3)}px 5px`,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 320,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class CheckoutSavedCardList extends React.Component {
  state = {
    cardForPayment: '',
    firebaseCards: []
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps;
    const _this = this;
    const firebaseCards = [];
    firebaseFirestoreDb.collection('stripe_customers/' + currentUser.uid + '/sources').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const source = doc.data();
        source.uid = doc.id;
        firebaseCards.push(source);
      });

      _this.setState({
        firebaseCards
      });
    });
  }

  handleChange = event => {
    this.setState({ cardForPayment: event.target.value });
    const { changePayment } = this.props;
    changePayment(event.target.value);
  };

  render() {
    const getCardList = (cardsArray) => cardsArray.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.brand}
        {' '}
**** **** ****
        {' '}
        { item.last4 }
        {' '}
        {item.exp_month}
/
        {item.exp_year}
      </MenuItem>
    ));
    const { cardForPayment, firebaseCards } = this.state;
    const {
      classes, cards
    } = this.props;
    const savedCardList = (cards.length > 0) ? cards : firebaseCards;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="payment-card">Choose from saved credit card</InputLabel>
          <Select
            value={cardForPayment}
            onChange={this.handleChange}
            inputProps={{
              name: 'paymentCard',
              id: 'payment-card',
            }}
            autoWidth
          >
            {getCardList(savedCardList)}
          </Select>
        </FormControl>
      </div>
    );
  }
}

CheckoutSavedCardList.propTypes = {
  classes: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  changePayment: PropTypes.func.isRequired
};

const reducerProfile = 'profileReducer';
const reducerCheckout = 'checkoutReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  cards: state.get(reducerCheckout).cards,
  ...state,
});
const CheckoutSavedCardListMapped = connect(
  mapStateToProps
)(CheckoutSavedCardList);
export default withStyles(styles)(CheckoutSavedCardListMapped);
