import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import ProfileCard from '../CardPaper/ProfileCard';
import messages from './messages';
import styles from './profile-jss';
import { firebaseFirestoreDb } from '../../firebase';
import imgApi from '../../api/images/photos';

import {
  USER_ROLE_MUSICIAN
} from './musicianConstants';

class MusiciansListCard extends React.Component {
  state = { musicians: [] };

  componentDidMount() {
    const { instrument } = this.props;

    const musicians = [];
    const _this = this;
    const queryParams = (instrument === 'all') ? ['role', '==', 'musician'] : ['instrument', '==', instrument];

    firebaseFirestoreDb.collection('users').where(...queryParams).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userData.connection = 203;
        userData.verified = false;
        userData.cover = imgApi[41];

        if (userData.role === USER_ROLE_MUSICIAN) {
          musicians.push(userData);
        }
      });
      _this.setState({
        musicians
      });
    });
  }

  render() {
    const { classes, intl } = this.props;
    const { musicians } = this.state;
    return (
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        direction="row"
        spacing={2}
        className={classes.rootx}
      >
        {
          musicians.map((data, index) => (
            <Grid item md={4} sm={6} xs={12} key={index.toString()}>
              <ProfileCard
                btnText={intl.formatMessage(messages.see_profile)}
                profileData={data}
              />
            </Grid>
          ))
        }
      </Grid>
    );
  }
}

MusiciansListCard.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  instrument: PropTypes.string.isRequired
};

export default withStyles(styles)(injectIntl(MusiciansListCard));
