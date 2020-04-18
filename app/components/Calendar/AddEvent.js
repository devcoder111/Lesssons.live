import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import FloatingPanel from '../Panel/FloatingPanel';
import AddEventForm from './AddEventForm';
import styles from './calendar-jss.js';


function getHours(startDate, stopDate) {
  const hoursArray = [];
  let currentDate = moment(startDate);
  const endDate = moment(stopDate);
  while (currentDate <= endDate) {
    hoursArray.push(moment(currentDate).format('LLLL'));
    currentDate = moment(currentDate).add(1, 'hours');
  }
  return hoursArray;
}

class AddEvent extends React.Component {
  showResult(values) {
    let calendarEvent = values;
    const { submit, currentUser } = this.props;
    const endTime = calendarEvent.getIn(['timeEnd']);
    const startTime = calendarEvent.getIn(['timeStart']);
    const date = calendarEvent.getIn(['start']);
    const startTimeWithDate = moment(date).hour(moment(startTime).hour()).minute(moment(startTime).minute()).second(0);
    const endTimeWithDate = moment(date).hour(moment(endTime).hour()).minute(moment(endTime).minute()).second(0);
    calendarEvent = calendarEvent.set('end', endTimeWithDate);
    calendarEvent = calendarEvent.set('start', startTimeWithDate);
    calendarEvent = calendarEvent.delete('timeEnd');
    calendarEvent = calendarEvent.delete('timeStart');
    const hours = getHours(startTimeWithDate, endTimeWithDate);
    const availableTimes = [];
    hours.forEach((time, index) => {
      if (typeof hours[index + 1] !== 'undefined') {
        const availableTime = {
          start: time,
          end: hours[index + 1],
          status: 'free'
        };
        availableTimes.push(availableTime);
      }
    });
    calendarEvent = calendarEvent.set('availableHours', availableTimes);
    setTimeout(() => {
      submit(calendarEvent, currentUser.uid);
    }, 500); // simulate server latency
  }

  render() {
    const {
      classes,
      openForm,
      closeForm,
      addEvent
    } = this.props;
    const branch = '';
    return (
      <div>
        <Tooltip title="Add New Event">
          <Fab color="secondary" onClick={() => addEvent()} className={classes.addBtn}>
            <Add />
          </Fab>
        </Tooltip>
        <FloatingPanel title="Add New Event" openForm={openForm} branch={branch} closeForm={() => closeForm()}>
          <AddEventForm onSubmit={(values) => this.showResult(values)} />
        </FloatingPanel>
      </div>
    );
  }
}

AddEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  openForm: PropTypes.bool.isRequired,
  addEvent: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddEvent);
