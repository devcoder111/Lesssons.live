import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import AppBar from '@material-ui/core/AppBar';
import dummy from 'enl-api/dummy/dummyContents';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import Schedule from '@material-ui/icons/Schedule';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import { withStyles } from '@material-ui/core/styles';
import {
  Cover,
  About,
  Albums,
  MusicianCalendar
} from 'enl-components';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'enl-components/Profile/messages';
import styles from 'enl-components/Profile/cover-jss';
import { firebaseFirestoreDb } from '../../firebase';


function TabContainer(props) {
  const { children } = props;
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class LessonsLiveMusicianProfile extends React.Component {
  state = {
    value: 0,
    musician: {
      displayName: ''
    }
  };

  componentDidMount() {
    let user = [];
    const _this = this;
    const { match } = this.props;
    const { username } = match.params;
    firebaseFirestoreDb.collection('users').where('username', '==', username).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        user = doc.data();
        user.uid = doc.id;
      });
      _this.setState({
        musician: user
      });
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  render() {
    const title = brand.name + ' - Profile';
    const description = brand.desc;
    const { classes, intl } = this.props;

    const { value, musician } = this.state;
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
        <Cover
          coverImg=""
          avatar={dummy.user.avatar}
          user={musician}
          handleEditProfile={() => this.handleClickOpen('Profile settings',)}
          desc={musician.headline}
        />
        <AppBar position="static" className={classes.profileTab}>
          <Hidden mdUp>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab icon={<AccountCircle />} />
              <Tab icon={<SupervisorAccount />} />
              <Tab icon={<PhotoLibrary />} />
            </Tabs>
          </Hidden>
          <Hidden smDown>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab icon={<AccountCircle />} label={intl.formatMessage(messages.about)} />
              <Tab icon={<Schedule />} label={intl.formatMessage(messages.availability)} />
              <Tab icon={<PhotoLibrary />} label={intl.formatMessage(messages.albums)} />
            </Tabs>
          </Hidden>
        </AppBar>
        {value === 0 && <TabContainer><About /></TabContainer>}
        {value === 1 && <TabContainer><MusicianCalendar user={musician} /></TabContainer>}
        {value === 2 && <TabContainer><Albums /></TabContainer>}
      </div>
    );
  }
}

LessonsLiveMusicianProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(LessonsLiveMusicianProfile));
