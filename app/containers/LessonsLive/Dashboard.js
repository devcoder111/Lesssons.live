import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LessonsList } from 'enl-components';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
      paddingLeft: 0,
      paddingRight: theme.spacing(1),
      textTransform: 'capitalize',
      color: theme.palette.type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
    },
  },
  titleBreadcrumbs: {
    margin: `${theme.spacing(3)}px 0`,
  },
  lessonsList: {
    padding: `${theme.spacing(3)}px`,
  }
});

class LessonsLiveDashboard extends React.Component {
  render() {
    const { classes, currentUser } = this.props;
    console.log('Dashboard user :', currentUser);
    return (
      <div>
        <Grid container spacing={1} alignitems="flex-end" className={classes.titleBreadcrumbs}>
          <Grid item>
            <div className={classes.pageTitle}>
              <Typography component="h4" variant="h4" alignitems="flex-end">
                    Dashboard
              </Typography>
            </div>
          </Grid>
        </Grid>


        <Grid container spacing={3} className={classes.root}>
          <Grid item md={8} xs={12}>
            <LessonsList user={currentUser} />
          </Grid>
          <Grid item md={4} xs={12} />
        </Grid>


      </div>
    );
  }
}

LessonsLiveDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});

const LessonsLiveDashboardMapped = connect(
  mapStateToProps
)(LessonsLiveDashboard);

export default withStyles(styles)(LessonsLiveDashboardMapped);
