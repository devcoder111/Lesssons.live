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
import FavoriteIcon from '@material-ui/icons/Favorite';
import { withStyles } from '@material-ui/core/styles';
import {
  Cover,
  About,
  Albums
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

class LessonsLiveRegularProfile extends React.Component {
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
              <Tab icon={<FavoriteIcon />} />
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
              <Tab icon={<FavoriteIcon />} label="Favorites" />
            </Tabs>
          </Hidden>
        </AppBar>
        {value === 0 && <TabContainer><About /></TabContainer>}
        {value === 1 && <TabContainer><Albums /></TabContainer>}
      </div>
    );
  }
}

LessonsLiveRegularProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(LessonsLiveRegularProfile));
