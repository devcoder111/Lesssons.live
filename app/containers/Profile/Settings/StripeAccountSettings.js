import React from 'react';
import { PropTypes } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PaymentList } from 'enl-components';
import styles from './settings-jss';
import stripeConfig from './stripeConfig';
import { firebaseFirestoreDb } from '../../../firebase';


const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

class StripeAccountSettings extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stripeLoginUrl: '',
      balanceAvailable: 0,
      balancePending: 0
    };
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.fetchStripeData(data);
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    // Typical usage, don't forget to compare the props
    if (typeof prevProps.data.uid === 'undefined' && typeof data.uid !== 'undefined') {
      this.fetchStripeData(data);
    }
  }

  fetchStripeData(data) {
    if (data.stripe_account_id) {
      const _this = this;
      this.setState({
        loading: true
      });
      console.log('fetchStripeData :');
      firebaseFirestoreDb
        .collection('stripe_accounts')
        .doc(data.uid)
        .set({ status: 'in_progress' }, { merge: true })
        .then(() => {
          firebaseFirestoreDb
            .collection('stripe_accounts')
            .doc(data.uid)
            .onSnapshot((doc) => {
              const stripeData = doc.data();
              console.log('stripeData :', stripeData);
              if (stripeData.status !== 'in_progress') {
                _this.setState({
                  loading: false,
                  stripeLoginUrl: stripeData.login_link,
                  balancePending: stripeData.balancePending,
                  balanceAvailable: stripeData.balanceAvailable,
                });
              }
            });
        });
    }
  }

  doneClick() {
    const { handleClose } = this.props;
    handleClose();
  }

  render() {
    const {
      classes,
      open,
      handleClose,
      title,
      data
    } = this.props;
    const {
      stripeLoginUrl,
      loading,
      balanceAvailable,
      balancePending
    } = this.state;
    const stripeLink = `${stripeConfig.oauthUrl}?redirect_uri=${stripeConfig.redirectUri}&client_id=${stripeConfig.clientId}&state=${data.uid}`;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Button color="inherit" onClick={() => this.doneClick()}>
              done
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.detailWrap}>
          <Grid container spacing={3} alignItems="flex-start" direction="row" justify="center">
            {!data.stripe_account_id && (
              <Grid item xs={12} md={6}>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
  Configure your payout settings with Stripe to automatically have your lesson payments sent to your bank account.
                    {' '}
                  </Typography>
                </div>
                <div>&nbsp;</div>
                <div>
                  <Button variant="contained" color="secondary" onClick={() => window.open(stripeLink, '_blank')}>Add Stripe Account</Button>
                </div>
              </Grid>
            )}
            {data.stripe_account_id && !loading && (
              <Grid item xs={12} md={9}>
                <Grid container>
                  <Grid item xs={6}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Avatar alt="avatar" src={data.avatarUrl} className={classes.avatar} />
                      </Grid>
                      <Grid item xs={9}>
                        {data.displayName}
                        <div>
                          <a href="#" onClick={() => window.open(stripeLoginUrl + '#/account', '_blank')} target="_blank" className={classes.link}>
                            View Stripe account
                          </a>
                        </div>

                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container>
                      <Grid item xs={4}>
                        <div>This week</div>
                        <div>
$
                          {balancePending / 100}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                          Your balance
                        <div>
$
                          {balanceAvailable / 100}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="contained" color="secondary" onClick={() => formValueSelector}>Pay out now</Button>
                        <div>
                          <a onClick={() => window.open(stripeLoginUrl, '_blank')} href="#" className={classes.link}>
                            View payouts on Stripe
                          </a>
                        </div>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Grid>
            )}
            <PaymentList user={data} />
          </Grid>
        </div>
      </Dialog>
    );
  }
}
StripeAccountSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(StripeAccountSettings);
