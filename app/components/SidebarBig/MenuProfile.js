import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import dummy from 'enl-api/dummy/dummyContents';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from 'enl-api/ui/menuMessages';
import styles from './sidebarBig-jss';

class MenuProfile extends React.Component {
  state = {
    status: dummy.user.status,
    anchorEl: null,
  }

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeStatus = status => {
    this.setState({ status });
    this.handleClose();
  }

  render() {
    const { classes, currentUser } = this.props;
    const { anchorEl, status } = this.state;
    const setStatus = st => {
      switch (st) {
        case 'online':
          return classes.online;
        case 'idle':
          return classes.idle;
        case 'bussy':
          return classes.bussy;
        default:
          return classes.offline;
      }
    };

    return (
      <div>
        <ButtonBase className={classes.avatarHead} onClick={this.handleOpen}>
          <Avatar
            alt={currentUser.displayName}
            src={currentUser.avatarUrl}
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <i className={classNames(classes.dotStatus, classes.pinned, setStatus(status))} />
        </ButtonBase>
        <Menu
          id="status-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          className={classes.statusMenu}
        >
          <MenuItem className={classes.profile}>
            <Avatar
              alt={currentUser.displayName}
              src={currentUser.avatarUrl}
              className={classNames(classes.avatar, classes.bigAvatar)}
            />
            <div className={classes.name}>
              <h5>{currentUser.displayName }</h5>
              <i className={classNames(classes.dotStatus, setStatus(status))} />
              <FormattedMessage {...messages[status]} />
            </div>
          </MenuItem>
          <MenuItem onClick={() => this.handleChangeStatus('online')}>
            <i className={classNames(classes.dotStatus, classes.online)} />
            <FormattedMessage {...messages.online} />
          </MenuItem>
          <MenuItem onClick={() => this.handleChangeStatus('idle')}>
            <i className={classNames(classes.dotStatus, classes.idle)} />
            <FormattedMessage {...messages.idle} />
          </MenuItem>
          <MenuItem onClick={() => this.handleChangeStatus('bussy')}>
            <i className={classNames(classes.dotStatus, classes.bussy)} />
            <FormattedMessage {...messages.bussy} />
          </MenuItem>
          <MenuItem onClick={() => this.handleChangeStatus('offline')}>
            <i className={classNames(classes.dotStatus, classes.offline)} />
            <FormattedMessage {...messages.offline} />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

MenuProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

MenuProfile.defaultProps = {
  anchorEl: null,
  isLogin: false,
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});
const MenuProfileMapped = connect(
  mapStateToProps
)(MenuProfile);

export default withStyles(styles)(injectIntl(MenuProfileMapped));
