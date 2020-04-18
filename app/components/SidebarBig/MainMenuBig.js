import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import Icon from '@material-ui/core/Icon';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import messages from 'enl-api/ui/menuMessages';
import MenuProfile from './MenuProfile';
import styles from './sidebarBig-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

class MainMenuBig extends React.Component { // eslint-disable-line
  state = { selectedMenu: [] };

  handleLoadMenu(menu) {
    this.setState({
      selectedMenu: menu
    });
  }

  handleLoadPage() {
    const { loadTransition, toggleDrawerOpen } = this.props;
    toggleDrawerOpen();
    loadTransition(false);
  }

  render() {
    const {
      classes,
      open,
      dataMenu,
      location
    } = this.props;

    const { selectedMenu } = this.state;
    const activeMenu = (key, child) => {
      if (selectedMenu.length < 1) {
        if (open.indexOf(key) > -1) {
          return true;
        }
        return false;
      }
      if (child === selectedMenu) {
        return true;
      }
      return false;
    };
    const getMenus = menuArray => menuArray.map((item, index) => {
      if (item.key === 'menu_levels') {
        return false;
      }
      if (item.child) {
        return (
          <ButtonBase
            key={index.toString()}
            focusRipple
            className={
              classNames(
                classes.menuHead,
                activeMenu(item.key, item.child) ? classes.active : ''
              )
            }
            onClick={() => this.handleLoadMenu(item.child)}
          >
            <Icon className={classes.icon}>{item.icon}</Icon>
            <span className={classes.text}>
              {
                messages[item.key] !== undefined
                  ? <FormattedMessage {...messages[item.key]} />
                  : item.name
              }
            </span>
          </ButtonBase>
        );
      }

      return (
        <ButtonBase
          key={index.toString()}
          focusRipple
          className={classNames(classes.menuHead, (open.indexOf(item.key) > -1 || location.pathname === item.link) ? classes.active : '')}
          component={LinkBtn}
          to={item.link}
        >
          <Icon className={classes.icon}>{item.icon}</Icon>
          <span className={classes.text}>
            {
              messages[item.key] !== undefined
                ? <FormattedMessage {...messages[item.key]} />
                : item.name
            }
          </span>
        </ButtonBase>
      );
    });

    return (
      <aside className={classes.bigSidebar}>
        <nav className={classes.category}>
          <div className={classes.fixedWrap}>
            <MenuProfile />
            {getMenus(dataMenu)}
          </div>
        </nav>
      </aside>
    );
  }
}

MainMenuBig.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  dataMenu: PropTypes.array.isRequired,
  loadTransition: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  toggleDrawerOpen: PropTypes.func,
  intl: intlShape.isRequired,
  location: PropTypes.object.isRequired
};

MainMenuBig.defaultProps = {
  toggleDrawerOpen: () => {},
  mobile: false
};

const reducer = 'ui';

const mapStateToProps = state => ({
  open: state.getIn([reducer, 'subMenuOpen']),
  ...state
});

const MainMenuBigMapped = connect(
  mapStateToProps
)(MainMenuBig);

export default withStyles(styles)(injectIntl(withRouter(MainMenuBigMapped)));
