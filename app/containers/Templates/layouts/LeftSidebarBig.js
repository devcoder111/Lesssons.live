import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import {
  Header,
  SidebarBig,
  // BreadCrumb,
} from 'enl-components';
import dataMenu from 'enl-api/ui/menu';
import { injectIntl } from 'react-intl';
import styles from '../appStyles-jss';

class LeftSidebarBigLayout extends React.Component {
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
      place,
      signOut,
      userAttr,
      isLogin
    } = this.props;

    return (
      <Fragment>
        <Header
          toggleDrawerOpen={toggleDrawer}
          margin={sidebarOpen}
          mode={mode}
          title={place}
          history={history}
          signOut={signOut}
          dense
          isLogin={isLogin}
          avatar={userAttr.avatar}
        />
        <SidebarBig
          dataMenu={dataMenu}
          loadTransition={loadTransition}
          open={sidebarOpen}
          userAttr={userAttr}
          toggleDrawerOpen={toggleDrawer}
        />
        <main className={classNames(classes.content, !sidebarOpen ? classes.contentPaddingLeftSm : '')} id="mainContent">
          <section className={classNames(classes.mainWrap, classes.sidebarLayout)}>

            { !pageLoaded && (<img src="/images/spinner.gif" alt="spinner" className={classes.circularProgress} />) }
            <Fade
              in={pageLoaded}
              mountOnEnter
              unmountOnExit
              {...(pageLoaded ? { timeout: 700 } : {})}
            >
              <div className={!pageLoaded ? classes.hideApp : ''}>
                {/* Application content will load here */}
                { children }
              </div>
            </Fade>
          </section>
        </main>
      </Fragment>
    );
  }
}

LeftSidebarBigLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  titleException: PropTypes.array.isRequired,
  signOut: PropTypes.func.isRequired,
  isLogin: PropTypes.bool,
  userAttr: PropTypes.object.isRequired,
};

LeftSidebarBigLayout.defaultProps = {
  isLogin: false
};

export default (withStyles(styles)(injectIntl(LeftSidebarBigLayout)));
