import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { RegisterForm } from 'enl-components';
import styles from 'enl-components/Forms/user-jss';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.png';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class Register extends React.Component {
  state = {
    valueForm: []
  }

  submitForm(values) {
    setTimeout(() => {
      this.setState({ valueForm: values });
      console.log(`You submitted:\n\n${this.state.valueForm.get('email')}`); // eslint-disable-line
      window.location.href = '/dashboard';
    }, 500); // simulate server latency
  }

  render() {
    const title = brand.name + ' - Register';
    const description = brand.desc;
    const { classes } = this.props;
    return (
      <div className={classes.rootFull}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.containerSide}>
          <Hidden smDown>
            <div className={classes.opening}>
              <div className={classes.openingWrap}>
                <div className={classes.openingHead}>
                  <NavLink to="/" className={classes.brand}>
                    <img src={logo} alt={brand.name} />
                  </NavLink>
                </div>
                <Typography variant="h3" component="h1" className={classes.opening} gutterBottom>
                  <FormattedMessage {...messages.greetingTitle} />
                </Typography>
                <Typography variant="h6" component="p" className={classes.subpening}>
                  <FormattedMessage {...messages.greetingSubtitle} />
                </Typography>
              </div>
              <div className={classes.openingFooter}>
                <NavLink to="/" className={classes.back}>
                  <ArrowBack />
                  &nbsp;back to home
                </NavLink>
              </div>
            </div>
          </Hidden>
          <div className={classes.sideFormWrap}>
            <RegisterForm onSubmit={(values) => this.submitForm(values)} />
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
