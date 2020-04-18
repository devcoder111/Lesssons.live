import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import Check from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/RemoveCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import dummy from 'enl-api/dummy/dummyContents';
import { injectIntl, FormattedMessage } from 'react-intl';
import messageStyles from 'enl-styles/Messages.scss';
import avatarApi from 'enl-api/images/avatars';
import {
  fetchNotification
} from '../../redux/actions/notificationActions';
import NotificationsActiveOutlined from '@material-ui/icons/NotificationsActiveOutlined';
import messages from './messages';
import styles from './header-jss';
import * as firebase from 'firebase/app';
import Close from '@material-ui/icons/Close';


class UserMenu extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    
    const {
     notifications
    } = this.props;
    const user = firebase.auth().currentUser;
    this.props.fetchNotificationFn(user.uid);

  };
  state = {
    anchorEl: null,
    openMenu: null
  };

  handleMenu = menu => (event) => {
    const { openMenu } = this.state;
    this.setState({
      openMenu: openMenu === menu ? null : menu,
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openMenu: null });
  };


  render() {
    const {
      classes,
      dark,
      signOut,
      avatar,
      currentUser,
      notifications,
      fetchNotificationFn
    } = this.props;
    const menuItemStyle = {
      display:"inline-block",
      width:"85%"
    };
    const { anchorEl, openMenu, notifyData } = this.state;
    const profileLink = (currentUser.role === 'musician') ? `/musician/${currentUser.username}` : `/profile/${currentUser.username}`;
    return (
      <div>
        <IconButton
          aria-haspopup="true"
          onClick={this.handleMenu('notification')}
          color="inherit"
          className={classNames(classes.notifIcon, dark ? classes.dark : classes.light)}
        >
          <Badge className={classes.badge} badgeContent={notifications.length} color="secondary">
            <NotificationsActiveOutlined />
          </Badge>
        </IconButton>
        <Menu
          id="menu-notification"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className={classes.notifMenu}
          PaperProps={{
            style: {
              width: 350,
            },
          }}
          open={openMenu === 'notification'}
          onClose={this.handleClose}
        >
        { notifications.length == 0 &&
          <div>
            
            <MenuItem onClick={this.handleClose} >
                <div className={messageStyles.messageSuccess}>
                  <ListItemAvatar>
                    <Avatar alt="User Name" src={avatarApi[0]} />
                    
                  </ListItemAvatar>
                  <ListItemText primary="You have no new notifications" className={classes.textNotif}  />
                </div>
              </MenuItem>
              
          </div>
        }

        {notifications.map((eachNotifyData, index) => (
          <div key={index}>

            <MenuItem onClick={this.handleClose} style={menuItemStyle}>
              <div className={messageStyles.messageSuccess}>
                <ListItemAvatar>
                  <Avatar alt="User Name" src={eachNotifyData.sender.avatarUrl} />
                  
                </ListItemAvatar>
                {eachNotifyData.receiver.role == "musician" &&
                <ListItemText primary={"You recieved the message from "+eachNotifyData.sender.displayName } className={classes.textNotif} secondary={eachNotifyData.start} />
                }
                {eachNotifyData.receiver.role != "musician" &&
                <ListItemText primary={"You sent the message to "+eachNotifyData.receiver.displayName } className={classes.textNotif} secondary={eachNotifyData.start} />
                }
                
              </div>
            </MenuItem>
            <div style={{display:"inline-block"}}> <IconButton><Close /> </IconButton></div>
            { index != notifications.length-1 &&
              <Divider variant="inset" />
            }
          </div>
        ))}
          
        </Menu>
        <Button onClick={this.handleMenu('user-setting')}>
          <Avatar
            alt="avatar"
            src={currentUser.avatarUrl || avatar}
          />
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={openMenu === 'user-setting'}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose} component={Link} to={profileLink}>
            <FormattedMessage {...messages.profile} />
          </MenuItem>
          <MenuItem onClick={this.handleClose} component={Link} to="/settings">
            <FormattedMessage {...messages.settings} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <FormattedMessage {...messages.logout} />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

UserMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  currentUser: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired
};

UserMenu.defaultProps = {
  dark: false
};

const mapDispatchToProps = {
  fetchNotificationFn: fetchNotification,
};

const reducerProfile = 'profileReducer';
const reducerNotification = 'notificationReducer'
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  notifications:state.get(reducerNotification).notifications,
  ...state,
});
const UserMenuMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);

export default withStyles(styles)(injectIntl(UserMenuMapped));
