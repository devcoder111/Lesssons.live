import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import PapperBlock from '../PapperBlock/PapperBlock';
import { firebaseFirestoreDb } from '../../firebase';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  taskList: {
    background: theme.palette.background.paper,
  }
});

class UpcomingLessons extends React.Component {
  state = {
    lessons: [],
    user: {}
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
    let lesson = [];
    const _this = this;
    firebaseFirestoreDb.collection('lessons').where('user.uid', '==', uid).get().then((querySnapshot) => {
      const lessonsList = [];
      querySnapshot.forEach((doc) => {
        lesson = doc.data();
        lesson.id = doc.id;
        lessonsList.push(lesson);
      });

      _this.setState({
        lessons: lessonsList
      });
    });
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps :', Object.keys(props.user).length, Object.keys(state.user).length);
    if (Object.keys(props.user).length !== Object.keys(state.user).length) {
      return {
        user: props.user
      };
    }

    return null;
  }

  handleToggle = value => () => {
    console.log('click :', value);
  }

  render() {
    const { classes } = this.props;
    const { lessons } = this.state;
    // this.getLessonsList(user.uid);
    console.log('lessons :', lessons);
    return (
      <PapperBlock
        title="Upcoming Lessons"
        icon="playlist_add_check"
        noMargin
        whiteBg
        colorMode="dark"
        desc="View all of your lessons in this list."
        className={classes.root}
      >
        {lessons.length > 0 && (
          <List className={classes.taskList}>
            {lessons.map(value => (
              <Fragment key={value.id}>
                <ListItem
                  key={value.id}
                  role={undefined}
                  dense
                  button
                  onClick={this.handleToggle(value.id)}
                  className={classes.listItem}
                >
                  <ListItemText primary={value.musician.displayName + ' ' + value.musician.headline} secondary={moment.utc(value.start).format('LL') + '. Time: ' + moment.utc(value.start).format('hh:mm a') + ' - ' + moment.utc(value.end).format('hh:mm a')} />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Comments">
                      <CommentIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            ))}
          </List>
        )}

      </PapperBlock>
    );
  }
}

UpcomingLessons.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(injectIntl(UpcomingLessons));
