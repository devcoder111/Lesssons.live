import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  CheckoutCardForm
} from 'enl-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { firebaseFirestoreDb } from '../../firebase';

const stripePromise = loadStripe('pk_test_QwN9lqvrCpimt6ga0lnKxD0700uF5AF1ms');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  taskList: {
    background: theme.palette.background.paper,
  },
  rootTable: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  noCards: {
    margin: `${theme.spacing(6)}px 0`
  }
});

class CardList extends React.Component {
  state = {
    firebaseCards: []
  };

  componentDidMount() {
    const { user } = this.props;
    const _this = this;
    const firebaseCards = [];
    firebaseFirestoreDb.collection('stripe_customers/' + user.uid + '/sources').get().then((querySnapshot) => {
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

  componentWillReceiveProps(newProps) {
    const { cards } = newProps;
    const { firebaseCards } = this.state;
    firebaseCards.push(cards[0]);
    this.setState({
      firebaseCards
    });
  }

  deleteCard(cardId) {
    const { user } = this.props;
    const { firebaseCards } = this.state;
    const _this = this;
    firebaseFirestoreDb.collection('stripe_customers/' + user.uid + '/sources').doc(cardId).delete().then(() => {
      const newFirebaseCards = firebaseCards.filter((item) => item.fingerprint !== cardId);
      _this.setState({
        firebaseCards: newFirebaseCards
      });
    });
  }

  render() {
    const { classes, user } = this.props;
    const { firebaseCards } = this.state;
    return (
      <div>
        <Grid container spacing={3} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <div>
              <Elements stripe={stripePromise}>
                <ElementsConsumer>
                  {({ stripe, elements }) => (
                    <CheckoutCardForm stripe={stripe} elements={elements} user={user} />
                  )}
                </ElementsConsumer>
              </Elements>
            </div>

            {firebaseCards.length === 0 && (
              <div className={classes.noCards}>
                <Typography variant="subtitle1" color="textSecondary">
                  No cards
                </Typography>
              </div>
            )}
            {firebaseCards.length > 0 && (
              <div className={classes.rootTable}>
                <Table className={classNames(classes.table, classes.stripped)}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Brand</TableCell>
                      <TableCell align="right">Number</TableCell>
                      <TableCell align="right">Expire date</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {firebaseCards.map(card => ([
                      <TableRow key={card.id}>
                        <TableCell>{card.brand}</TableCell>
                        <TableCell align="right">
**** **** ****
                          {card.last4}
                        </TableCell>
                        <TableCell align="right">
                          {card.exp_month}
/
                          {card.exp_year}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => this.deleteCard(card.fingerprint)}
                            className={classes.button}
                            aria-label="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ]))}
                  </TableBody>
                </Table>
              </div>
            )}

          </Grid>
        </Grid>
      </div>
    );
  }
}


CardList.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired
};

const reducerCheckout = 'checkoutReducer';
const mapStateToProps = state => ({
  cards: state.get(reducerCheckout).cards,
  ...state,
});
const CardListMapped = connect(
  mapStateToProps
)(CardList);

export default withStyles(styles)(CardListMapped);
