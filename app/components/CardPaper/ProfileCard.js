import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import Favorite from '@material-ui/icons/Favorite';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import Divider from '@material-ui/core/Divider';
import styles from './cardStyle-jss';
import history from '../../utils/history';

class ProfileCard extends React.Component {
  render() {
    const {
      classes,
      isVerified,
      btnText,
      profileData
    } = this.props;

    return (
      <Card className={classes.cardSocmed}>
        <CardMedia
          className={classes.mediaProfile}
          image={profileData.profileBackgroundUrl || profileData.cover}
          title="cover"
        />
        <CardContent className={classes.contentProfile}>
          <Avatar alt="avatar" src={profileData.avatarUrl} className={classes.avatarBig} />
          <Typography variant="h6" className={classes.name} gutterBottom>
            {profileData.displayName}
            {isVerified && <VerifiedUser className={classes.verified} />}
          </Typography>
          <Typography className={classes.subheading} gutterBottom>
            <span className={Type.regular}>{profileData.headline}</span>
          </Typography>
          <Typography variant="caption" component="p">
            {profileData.connection}
          </Typography>
          <Button className={classes.buttonProfile} size="large" variant="outlined" color="secondary" onClick={() => history.push('/musician/' + profileData.username)}>
            {btnText}
          </Button>
        </CardContent>
        <Divider />
        <CardActions>
          <BottomNavigation
            showLabels
            className={classes.bottomLink}
          >
            <BottomNavigationAction label="20 Connection" icon={<SupervisorAccount />} />
            <BottomNavigationAction label="10 Favorites" icon={<Favorite />} />
            <BottomNavigationAction label="5 Albums" icon={<PhotoLibrary />} />
          </BottomNavigation>
        </CardActions>
      </Card>
    );
  }
}

ProfileCard.propTypes = {
  classes: PropTypes.object.isRequired,
  profileData: PropTypes.object.isRequired,
  btnText: PropTypes.string.isRequired,
  isVerified: PropTypes.bool
};

ProfileCard.defaultProps = {
  isVerified: false
};

export default withStyles(styles)(ProfileCard);
