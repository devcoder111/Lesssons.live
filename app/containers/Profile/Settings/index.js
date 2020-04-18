import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import DetailSettings from './DetailSettings';
import CardSettings from './CardSettings';
import StripeAccountSettings from './StripeAccountSettings';
import NotificationSettings from './NotificationSettings';

import styles from './settings-jss';

class Settings extends React.Component {
  state = {
    openSettings: false,
    openCards: false,
    openStripeAccount: false,
    openNotificationSettings: false,
    checked: ['switch', 'check2'],
    settingTitle: 'Settings'
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClickOpenSettings = () => {
    this.setState({ openSettings: true, settingTitle: 'Profile Settings' });
  };

  handleCloseSettings = () => {
    this.setState({ openSettings: false });
  };

  handleClickOpenCards = () => {
    this.setState({ openCards: true, settingTitle: 'Credit card' });
  };

  handleCloseCards = () => {
    this.setState({ openCards: false });
  };

  handleClickOpenStripeAccount = () => {
    this.setState({ openStripeAccount: true, settingTitle: 'Payout Setup' });
  };

  handleClickOpenNotifications = () => {
    this.setState({ openNotificationSettings: true, settingTitle: 'Notification Settings' });
  };

  handleCloseStripeAccount = () => {
    this.setState({ openStripeAccount: false });
  };

  handleCloseNotificationSettings = () => {
    this.setState({ openNotificationSettings: false });
  };

  render() {
    const title = brand.name;
    const description = brand.desc;
    const { classes, currentUser } = this.props;
    const {
      openSettings,
      openCards,
      settingTitle,
      openStripeAccount,
      openNotificationSettings
    } = this.state;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Paper className={classes.paperStyled} elevation={0}>
          <Grid container spacing={2}>
            <Grid item sm={10} xs={12}>
              <div className={classes.profile}>
                <Avatar
                  alt={currentUser.displayName}
                  src={currentUser.avatarUrl}
                  className={classes.avatar}
                />
                <div className={classes.profileText}>
                  <h4>{currentUser.displayName}</h4>
                  {currentUser.headline}
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.root} elevation={4}>
          <section className={classes.settingList}>
            <Grid container spacing={2}>

              <Grid item key="settings" sm={4} xs={12}>
                <Button onClick={() => this.handleClickOpenSettings()} color="secondary" className={classes.button}>
                  <Icon className={classes.icon}>supervisor_account</Icon>
                  <span className={classes.text}>
                      Profile Settings
                    <Typography variant="caption" className={classes.info}>
                      Update your profile information
                    </Typography>
                  </span>
                </Button>
              </Grid>

              {currentUser.role === 'regular' && (
                <Grid item key="credit_card" sm={4} xs={12}>
                  <Button onClick={() => this.handleClickOpenCards()} color="secondary" className={classes.button}>
                    <Icon className={classes.icon}>chrome_reader_mode</Icon>
                    <span className={classes.text}>
                        Credit Card
                      <Typography variant="caption" className={classes.info}>
                          Manage your saved credit cards used for scheduling lessons
                      </Typography>
                    </span>
                  </Button>
                </Grid>
              )}
              {currentUser.role === 'musician' && (
                <Grid item key="credit_card" sm={4} xs={12}>
                  <Button onClick={() => this.handleClickOpenStripeAccount()} color="secondary" className={classes.button}>
                    <Icon className={classes.icon}>chrome_reader_mode</Icon>
                    <span className={classes.text}>
                        Payout Settings
                      <Typography variant="caption" className={classes.info}>
                         Set up your bank account for direct depost after lessons complete
                      </Typography>
                    </span>
                  </Button>
                </Grid>
              )}
              <Grid item key="notification_settings" sm={4} xs={12}>
                <Button onClick={() => this.handleClickOpenNotifications()} color="secondary" className={classes.button}>
                  <Icon className={classes.icon}>add_alert</Icon>
                  <span className={classes.text}>
                        Notifications
                    <Typography variant="caption" className={classes.info}>
                          Manage your email and text message notifications
                    </Typography>
                  </span>
                </Button>
              </Grid>
            </Grid>
          </section>
        </Paper>
        <DetailSettings open={openSettings} handleClose={this.handleCloseSettings} title={settingTitle} data={currentUser} />
        <CardSettings open={openCards} handleClose={this.handleCloseCards} title={settingTitle} data={currentUser} />
        <StripeAccountSettings open={openStripeAccount} handleClose={this.handleCloseStripeAccount} title={settingTitle} data={currentUser} />
        <NotificationSettings open={openNotificationSettings} handleClose={this.handleCloseNotificationSettings} title={settingTitle} data={currentUser} />
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});

const SettingsMapped = connect(
  mapStateToProps
)(Settings);


export default withStyles(styles)(SettingsMapped);
