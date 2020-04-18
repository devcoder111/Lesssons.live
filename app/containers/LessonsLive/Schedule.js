import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  PapperBlock,
  CheckoutPayment,
  LiveLessonsBreadcrumb
} from 'enl-components';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { bindActionCreators } from 'redux';
import {
  getMusicianEvents,
  updateMusicianEventHours
} from 'enl-redux/actions/calendarActions';
import {
  addLesson
} from 'enl-redux/actions/lessonActions';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { firebaseFirestoreDb } from '../../firebase';
import ProfileCard from '../../components/CardPaper/ProfileCard';
import imgApi from '../../api/images/photos';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  divider: {
    display: 'block',
    margin: `${theme.spacing(1)}px 0`,
  },
  picker: {
    margin: `${theme.spacing(1)}px 5px`,
  },
  timeSelect: {
    marginTop: '18px'
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
  titleBreadcrumbs: {
    margin: `${theme.spacing(3)}px 0`,
  }
});

function getDates(startDate, stopDate) {
  const dateArray = [];
  let currentDate = moment(startDate);
  const endDate = moment(stopDate);
  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

function calculateAvailableDates(datesList) {
  let availableDates = [];
  if (datesList.size > 0) {
    datesList.toJS().forEach((event) => {
      const dates = getDates(event.start, event.end);
      availableDates = [...availableDates, ...dates];
    });
  }
  availableDates = availableDates.filter((v, i, a) => a.indexOf(v) === i);
  return availableDates;
}

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0);
  return date;
}
function findClosestAvailableDate(availableDates, datesList) {
  availableDates.sort();
  const filteredAvailableDates = availableDates.filter((item) => moment(item).isAfter());
  const response = { closestAvailableDate: '', availableDates: [], closestAvailableHours: [] };
  filteredAvailableDates.forEach((date) => {
    const availableHours = getAvailableTimesByDate(date, datesList);
    if (response.closestAvailableHours.length === 0 && availableHours.length > 0) {
      response.closestAvailableDate = date;
      response.closestAvailableHours = availableHours;
    }
    if (availableHours.length > 0) {
      response.availableDates.push(date);
    }
  });
  return response;
}

function getAvailableTimesByDate(date, datesList) {
  let availableHours = [];
  if (datesList.size > 0) {
    datesList.toJS().forEach((event) => {
      if (moment(date).format('YYYY-MM-DD') === moment(event.start).format('YYYY-MM-DD')) {
        availableHours = event.availableHours.filter((item) => item.status === 'free');
      }
    });
  }
  return availableHours;
}

class LessonsLiveSchedule extends React.Component {
  state = {
    activeStep: 0,
    selectedDate: false,
    musician: {},
    paymentAmount: 0,
    musicianAvailable: [],
    selectedTimes: [],
    selectedTime: 0
  };

  componentDidMount() {
    const { match } = this.props;
    const { username } = match.params;
    let user = [];
    const _this = this;

    firebaseFirestoreDb.collection('users').where('username', '==', username).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        user = doc.data();
        user.uid = doc.id;
      });
      _this.setState({
        musician: user
      });
      _this.getMusicianEventsData(user.uid);
    });
  }

  static getDerivedStateFromProps(props, state) {
    const newAvailable = calculateAvailableDates(props.eventData);
    const oldAvailable = state.musicianAvailable;
    const availableDates = findClosestAvailableDate(newAvailable, props.eventData);
    if (newAvailable.length > 0 && oldAvailable.length !== availableDates.availableDates.length) {
      return {
        musicianAvailable: availableDates.availableDates,
        selectedTimes: availableDates.closestAvailableHours,
        selectedDate: new Date(availableDates.closestAvailableDate),
      };
    }
    return null;
  }

  getMusicianEventsData(uid) {
    const {
      getEventsData
    } = this.props;
    getEventsData(uid);
  }

  handleSelectedTimeChange = event => {
    this.setState({ selectedTime: event.target.value });
  };

  handleDateChange = (date) => {
    const { eventData } = this.props;
    const dateAvailableTimes = getAvailableTimesByDate(date, eventData);
    this.setState({
      selectedDate: date,
      selectedTimes: dateAvailableTimes
    });
  }

  nextToPayment = () => {
    const {
      activeStep,
      musician,
    } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
    const paymentAmount = parseInt(musician.hourlyRate);
    this.setState({ paymentAmount });
  };

  nextToSuccess = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  isBlocked = day => {
    const { musicianAvailable } = this.state;
    return !musicianAvailable.some(date => day.isSame(date), 'day');
  }

  paymentSuccess = () => {
    const {
      addLesson,
      currentUser,
      eventData,
      updateMusicianEventHours
    } = this.props;
    const {
      musician,
      selectedDate,
      selectedTime,
      selectedTimes
    } = this.state;
    this.nextToSuccess();
    addLesson(currentUser, musician, selectedTimes[selectedTime].start, selectedTimes[selectedTime].end);
    let availableDateId = '';
    const updatedAvailableHours = [];
    eventData.toJS().forEach((event) => {
      if (moment(selectedDate).format('YYYY-MM-DD') === moment(event.start).format('YYYY-MM-DD')) {
        availableDateId = event.docId;
        event.availableHours.forEach((hour) => {
          const updatedHour = hour;
          if (hour.start === selectedTimes[selectedTime].start) {
            updatedHour.status = 'paid';
          }
          updatedAvailableHours.push(updatedHour);
        });
      }
    });
    updateMusicianEventHours(musician.uid, availableDateId, updatedAvailableHours);
  }

  render() {
    const getTimesList = (timesArray) => timesArray.map((item, index) => (
      <MenuItem key={index} value={index}>
        {moment(item.start).format('hh:mm a') + ' - ' + moment(item.end).format('hh:mm a')}
      </MenuItem>
    ));
    const { classes } = this.props;
    const {
      activeStep,
      selectedDate,
      paymentAmount,
      selectedTimes,
      selectedTime,
      musician
    } = this.state;

    musician.connection = 203;
    musician.verified = false;
    musician.cover = imgApi[41];

    const breadcrumbs = [
      {
        title: musician.displayName,
        path: '/musician/' + musician.username,
      },
      {
        title: 'Schedule'
      }
    ];
    return (
      <div>
        <Grid container spacing={1} alignItems="flex-end" className={classes.titleBreadcrumbs}>
          <Grid item>
            <div className={classes.pageTitle}>
              <Typography component="h4" variant="h4">
                    Schedule
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <LiveLessonsBreadcrumb theme="dark" separator=" / " breadcrumbs={breadcrumbs} />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <ProfileCard
                btnText="See profile"
                profileData={musician}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              {selectedTimes.length === 0 && (
                <Typography>
                  NO AVAILABLE DATES
                </Typography>
              )}
              {selectedTimes.length > 0 && (
                <Stepper activeStep={activeStep} orientation="vertical">
                  <Step>
                    <StepLabel>Choose date and time</StepLabel>

                    <StepContent>

                      <Typography variant="button" className={classes.divider}>Musician available dates</Typography>
                      <Grid container spacing={2}>
                        <Grid item>

                          {selectedDate && (
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                              <DatePicker
                                label="Clearable"
                                clearable
                                maxDateMessage="Date must be less than today"
                                value={selectedDate}
                                onChange={this.handleDateChange}
                                animateYearScrolling={false}
                                disablePast
                                shouldDisableDate={this.isBlocked}
                                maxDate={new Date('2020-04-30')}
                              />
                            </MuiPickersUtilsProvider>
                          )}
                        </Grid>
                        <Grid item>
                          {selectedDate && (
                            <Select
                              value={selectedTime}
                              onChange={this.handleSelectedTimeChange}
                              inputProps={{
                                name: 'selectedTime',
                                id: 'selected-time',
                              }}
                              autoWidth
                              className={classes.timeSelect}
                            >
                              {getTimesList(selectedTimes)}
                            </Select>
                          )}
                        </Grid>
                      </Grid>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.nextToPayment}
                        className={classes.button}
                      >
                              Go to payment
                      </Button>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Payment</StepLabel>
                    <StepContent>

                      <div>
                          Payment is
                        {' '}
                        {paymentAmount}
$.
                      </div>
                      <div>
                        Lesson date:
                        {moment(selectedDate).format('YYYY-MM-DD')}
                        {' '}

                      </div>
                      <div>
        Time:
                        {' '}
                        {moment(selectedTimes[selectedTime].start).format('hh:mm a') + ' - ' + moment(selectedTimes[selectedTime].end).format('hh:mm a')}

                      </div>

                      {musician.stripe_account_id && (
                        <CheckoutPayment amount={paymentAmount} successHandler={this.paymentSuccess} destinationUser={musician} />
                      )}
                      {!musician.stripe_account_id && (
                        <Typography variant="button" className={classes.divider}>Musician doesn't have Stripe Account</Typography>
                      )}
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                                Back
                      </Button>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Continue</StepLabel>
                    <StepContent>
                      <Typography>Success payment and redirect button to Upcoming lessons</Typography>

                    </StepContent>
                  </Step>

                </Stepper>
              )}
            </Grid>
          </Grid>


        </div>


      </div>
    );
  }
}

LessonsLiveSchedule.propTypes = {
  currentUser: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  eventData: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  updateMusicianEventHours: PropTypes.func.isRequired,
  addLesson: PropTypes.func.isRequired,
};
LessonsLiveSchedule.defaultProps = {
  showErrorsInline: false,
  dispatch: () => {},
};
const reducerProfile = 'profileReducer';
const reducerCalendar = 'calendar';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  eventData: state.getIn([reducerCalendar, 'events']),
  ...state,
});

const dispatchToProps = dispatch => ({
  getEventsData: bindActionCreators(getMusicianEvents, dispatch),
  addLesson: bindActionCreators(addLesson, dispatch),
  updateMusicianEventHours: bindActionCreators(updateMusicianEventHours, dispatch),
});

const LessonsLiveScheduleMapped = connect(
  mapStateToProps,
  dispatchToProps
)(LessonsLiveSchedule);

export default withStyles(styles)(LessonsLiveScheduleMapped);
