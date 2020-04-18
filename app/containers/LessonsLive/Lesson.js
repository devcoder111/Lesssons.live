import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  TwilioVideo,
  LessonChat
} from 'enl-components';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { firebaseFirestoreDb } from '../../firebase';
import history from '../../utils/history';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  pageTitle: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    '& h4': {
      fontWeight: 700,
      fontSize: 24,
      paddingLeft: 10,
      paddingRight: theme.spacing(1),
      textTransform: 'capitalize',
      color: theme.palette.type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
    },
  },
});

class Lesson extends React.Component {
  state = {
    participant: {}
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (typeof currentUser.uid !== 'undefined') {
      this.getParticipant(currentUser.uid);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentUser } = this.props;
    if (typeof prevProps.currentUser.uid === 'undefined' && typeof currentUser.uid !== 'undefined') {
      this.getParticipant(currentUser.uid);
    }
  }

  getParticipant(currentUserUid) {
    const { match } = this.props;
    const { hash } = match.params;

    console.log('getParticipant :', currentUserUid, hash);
    firebaseFirestoreDb.collection('lessons').doc(hash)
      .onSnapshot((doc) => {
        const lesson = doc.data();
        if (currentUserUid !== lesson.musician.uid && currentUserUid !== lesson.user.uid) {
          history.push('/dashboard');
        }
        const participant = (lesson.musician.uid === currentUserUid) ? lesson.user : lesson.musician;
        this.setState({
          participant
        });
      });
  }

  render() {
    const { participant } = this.state;
    const { currentUser, classes, match } = this.props;
    const { hash } = match.params;
    console.log('participant :', participant);
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item>
            <div className={classes.pageTitle}>
              <Typography component="h4" variant="h4">
                Lesson Room
              </Typography>
            </div>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <LessonChat currentUser={currentUser} participant={participant} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TwilioVideo roomName={hash} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}


Lesson.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};
const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});
const LessonMapped = connect(
  mapStateToProps
)(Lesson);

export default withStyles(styles)(LessonMapped);
