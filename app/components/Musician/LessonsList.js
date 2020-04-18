import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { MusicianCard } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import { firebaseFirestoreDb } from '../../firebase';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  taskList: {
    background: theme.palette.background.paper,
  },
  toggleBlock: {
    margin: `${theme.spacing(3)}px 0`,
  }
});

function filterLessons(filter, lessons) {
  let filteredLessons = [];
  if (filter === 'upcoming') {
    filteredLessons = lessons.filter((lesson) => moment(lesson.start).isAfter());
  } else {
    filteredLessons = lessons.filter((lesson) => moment(lesson.start).isBefore());
  }
  return filteredLessons;
}

class LessonsList extends React.Component {
  state = {
    lessons: [],
    filteredLessons: [],
    user: {},
    filter: 'upcoming',
    loading: true
  };

  componentDidMount() {
    const { user } = this.props;
    if (typeof user.uid !== 'undefined') {
      this.getLessonsList(user.uid);
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (typeof prevProps.user.uid === 'undefined' && typeof user.uid !== 'undefined') {
      this.getLessonsList(user.uid);
    }
  }

  getLessonsList(uid) {
    const { user } = this.props;
    const { filter } = this.state;
    let lesson = [];
    const _this = this;

    const queryParams = (user.role === 'regular') ? ['user.uid', '==', uid] : ['musician.uid', '==', uid];
    firebaseFirestoreDb.collection('lessons').where(...queryParams).get().then((querySnapshot) => {
      const lessonsList = [];
      querySnapshot.forEach((doc) => {
        lesson = doc.data();
        lesson.id = doc.id;
        lessonsList.push(lesson);
      });
      const filteredLessons = filterLessons(filter, lessonsList);
      _this.setState({
        lessons: lessonsList,
        filteredLessons,
        loading: false
      });
    });
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps :', Object.keys(props.user).length, Object.keys(state.user).length);
    if (Object.keys(props.user).length !== Object.keys(state.user).length) {
      return {
        user: props.user,
      };
    }

    return null;
  }


  handleAlignment = (event, filter) => {
    const { lessons } = this.state;
    const filteredLessons = filterLessons(filter, lessons);
    this.setState({ filter, filteredLessons });
  }

  render() {
    const {
      filteredLessons,
      lessons,
      filter,
      loading
    } = this.state;
    const { classes, user } = this.props;

    return (
      <Grid container spacing={1}>
        {lessons.length === 0 && !loading && (
          <Typography component="p">
            {user.role === 'regular' && (
              <div>You have no scheduled lessons at the moment. View all Musicians to start scheduling a lesson now!</div>
            )}
            {user.role === 'musician' && (
              <div>You have no scheduled lessons at the moment. Edit your profile, and set your available dates for lessons now!</div>
            )}
          </Typography>
        )}
        {lessons.length > 0 && (
          <Grid container spacing={2}>
            <Grid container spacing={0} justify="flex-end" direction="row" className={classes.toggleBlock}>
              <Grid item>
                <ToggleButtonGroup value={filter} exclusive onChange={this.handleAlignment}>
                  <ToggleButton value="upcoming">
                    Upcoming Lessons
                  </ToggleButton>
                  <ToggleButton value="past">
                    Past Lessons
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            {
              filteredLessons.map((lesson, index) => (

                <Grid item md={4} sm={6} xs={12} key={index.toString()}>
                  <MusicianCard
                    lesson={lesson}
                    user={user}
                  />
                </Grid>
              ))
            }
          </Grid>
        )}

      </Grid>
    );
  }
}

LessonsList.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(injectIntl(LessonsList));
