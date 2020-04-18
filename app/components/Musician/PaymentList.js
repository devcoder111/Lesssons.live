import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
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

class PaymentList extends React.Component {
  state = {
    payments: []
  };

  componentDidMount() {
    const { user } = this.props;
    const _this = this;
    const firebasePayments = [];
    firebaseFirestoreDb.collection('stripe_accounts/' + user.uid + '/payments').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        firebasePayments.push(doc.data());
      });

      _this.setState({
        payments: firebasePayments
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { payments } = this.state;
    console.log('payments :', payments);
    payments.map(payment => { console.log('payment :', payment); }
    );
    return (

      <Grid container spacing={3} alignItems="flex-start" direction="row" justify="center">
        <Grid item xs={12} md={9}>
          {payments.length === 0 && (
            <div className={classes.noCards}>
              <Typography variant="subtitle1" color="textSecondary">
                  No payments yet
              </Typography>
            </div>
          )}
          {payments.length > 0 && (
            <div className={classes.rootTable}>
              <Typography variant="subtitle1" color="textSecondary">
                  Recent lessons
              </Typography>
              <Table className={classNames(classes.table, classes.stripped)}>
                <TableBody>
                  {payments.map(payment => ([
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Avatar alt="avatar" src={payment.sender.avatarUrl} className={classes.avatar} />
                      </TableCell>
                      <TableCell>{payment.sender.displayName}</TableCell>
                      <TableCell align="right">
                        {moment.utc(payment.created * 1000).format('LLL')}
                      </TableCell>
                      <TableCell align="right">
                          $
                        {(payment.amount - payment.application_fee_amount) / 100}
                      </TableCell>
                    </TableRow>
                  ]))}
                </TableBody>
              </Table>
            </div>
          )}

        </Grid>
      </Grid>

    );
  }
}


PaymentList.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(PaymentList);
