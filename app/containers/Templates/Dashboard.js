import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { toggleAction, openAction, playTransitionAction } from 'enl-redux/actions/uiActions';
import { logout } from 'enl-redux/actions/authActions';
import dummy from 'enl-api/dummy/dummyContents';
import LeftSidebarBigLayout from './layouts/LeftSidebarBig';
import styles from './appStyles-jss';

class Dashboard extends React.Component {
  componentDidMount = () => {
    const { history, initialOpen, loadTransition } = this.props;

    // Set expanded sidebar menu
    const currentPath = history.location.pathname;
    initialOpen(currentPath);
    // Play page transition
    loadTransition(true);

    // Execute all arguments when page changes
    this.unlisten = history.listen(() => {
      window.scrollTo(0, 0);
      setTimeout(() => {
        loadTransition(true);
      }, 500);
    });
  }

  render() {
    const {
      classes,
      children,
      toggleDrawer,
      sidebarOpen,
      loadTransition,
      pageLoaded,
      mode,
      history,
      signOut,
      user,
      isAuthenticated
    } = this.props;
    const titleException = ['/app', '/app/crm-dashboard', '/app/crypto-dashboard'];
    const parts = history.location.pathname.split('/');
    const place = parts[parts.length - 1].replace('-', ' ');
    const profile = userProfile => {
      if (userProfile) {
        return {
          avatar: userProfile.photoURL || dummy.user.avatar,
          name: userProfile.displayName
        };
      }
      return {
        avatar: dummy.user.avatar,
        name: dummy.user.name
      };
    };
    return (
      <div
        className={
          classNames(
            classes.appFrameInner,
            classes.sideNav,
            'light-mode'
          )
        }
      >
        <LeftSidebarBigLayout
          history={history}
          toggleDrawer={toggleDrawer}
          loadTransition={loadTransition}
          sidebarOpen={sidebarOpen}
          pageLoaded={pageLoaded}
          mode={mode}
          place={place}
          titleException={titleException}
          signOut={signOut}
          isLogin={isAuthenticated}
          userAttr={profile(user)}
        >
          { children }
        </LeftSidebarBigLayout>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  initialOpen: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  signOut: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
  user: null,
  isAuthenticated: null
};

const reducerUi = 'ui';
const reducerAuth = 'authReducer';
const mapStateToProps = state => ({
  sidebarOpen: state.getIn([reducerUi, 'sidebarOpen']),
  pageLoaded: state.getIn([reducerUi, 'pageLoaded']),
  mode: state.getIn([reducerUi, 'type']),
  layout: state.getIn([reducerUi, 'layout']),
  isAuthenticated: state.get(reducerAuth).loggedIn,
  user: state.get(reducerAuth).user,
  ...state,
});

const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => dispatch(toggleAction),
  initialOpen: bindActionCreators(openAction, dispatch),
  loadTransition: bindActionCreators(playTransitionAction, dispatch),
  signOut: bindActionCreators(logout, dispatch)
});

const DashboardMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default (withStyles(styles)(DashboardMaped));
