import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Info from '@material-ui/icons/Info';
import Stars from '@material-ui/icons/Stars';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './cover-jss';
import history from '../../utils/history';


class Cover extends React.Component {
  render() {
    const {
      classes,
      avatar,
      user,
      currentUser,
    } = this.props;
    const userData = user.username === currentUser.username ? currentUser : user;
    const avatarUrl = userData.avatarUrl ? userData.avatarUrl : avatar;
    return (
      <div className={classes.cover} style={{ backgroundImage: `url(${userData.profileBackgroundUrl})` }}>
        {userData.role === 'musician' && (
          <div className={classes.opt}>
            <IconButton className={classes.button} aria-label="Delete">
              <Stars />
            </IconButton>
            <IconButton className={classes.button} aria-label="Delete">
              <Info />
            </IconButton>
          </div>
        )}

        <div className={classes.content}>
          <Avatar alt={user.displayName} src={avatarUrl} className={classes.avatar} />
          <Typography variant="h4" className={classes.name} gutterBottom>
            {userData.displayName}
            {userData.role === 'musician' && (
              <VerifiedUser className={classes.verified} />
            )}
          </Typography>
          <Typography className={classes.subheading} gutterBottom>
            {userData.headline}
          </Typography>
          {user.username !== currentUser.username && (
            <Button className={classes.button} size="large" variant="contained" color="secondary" onClick={() => history.push('/musician/' + userData.username + '/schedule')}>
              <FormattedMessage {...messages.schedule_lesson} />
            </Button>
          )}

        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  classes: PropTypes.object.isRequired,
  avatar: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});
const CoverMapped = connect(
  mapStateToProps
)(Cover);

export default withStyles(styles)(injectIntl(CoverMapped));
