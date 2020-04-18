import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { NavLink, Link } from 'react-router-dom';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.png';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import link from 'enl-api/ui/link';
import UserMenu from './UserMenu';
import messages from './messages';
import styles from './header-jss';

class Header extends React.Component {
  state = {
    open: false,
    turnDarker: true,
    showTitle: false
  };

  // Initial header style
  flagDarker = true;

  flagTitle = false;

  render() {
    const {
      classes,
      toggleDrawerOpen,
      margin,
      signOut,
      dense,
      isLogin,
      avatar,
    } = this.props;
    const {
      open,
      turnDarker,
      showTitle
    } = this.state;

    return (
      <AppBar
        className={classNames(
          classes.appBar,
          classes.floatingBar,
          margin && classes.appBarShift,
          turnDarker && classes.darker,
        )}
      >
        <Toolbar disableGutters={!open}>
          <div className={classNames(classes.brandWrap, dense && classes.dense)}>
            <Hidden lgUp>
              <span>
                <IconButton
                  className={classes.menuButton}
                  aria-label="Menu"
                  onClick={toggleDrawerOpen}
                >
                  <MenuIcon />
                </IconButton>
              </span>
            </Hidden>
            <Hidden smDown>
              <NavLink to="/dashboard" className={classNames(classes.brand, classes.brandBar)}>
                <img src={logo} alt={brand.name} />
              </NavLink>
            </Hidden>
          </div>
          <Hidden smDown>
            <div className={classes.headerProperties}>
              <div
                className={classNames(
                  classes.headerAction,
                  showTitle && classes.fadeOut,
                )}
              />
            </div>
          </Hidden>

          <Hidden xsDown>
            <span className={classes.separatorV} />
          </Hidden>
          <div className={classes.userToolbar}>
            {isLogin
              ? <UserMenu signOut={signOut} avatar={avatar} />
              : (
                <Button
                  color="primary"
                  className={classes.buttonTop}
                  component={Link}
                  to={link.login}
                  variant="contained"
                >
                  <AccountCircle />
                  <FormattedMessage {...messages.login} />
                </Button>
              )
            }
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  margin: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool,
  dense: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  signOut: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

Header.defaultProps = {
  dense: false,
  isLogin: false
};

export default withStyles(styles)(injectIntl(Header));
