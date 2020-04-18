import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import 'enl-styles/vendors/react-big-calendar/react-big-calendar.css';
import {
  EventCalendar,
  DetailEvent,
  AddEvent,
  Notification
} from 'enl-components';
import {
  addAction,
  discardAction,
  closeNotifAction
} from 'enl-actions/CalendarEventActions';
import {
  addMusicianEvent,
  getMusicianEvents,
  deleteMusicianEvent
} from 'enl-redux/actions/calendarActions';

const styles = {
  root: {
    display: 'block'
  }
};

class MusicianCalendar extends React.Component {
  state = {
    anchorEl: false,
    event: null,
    anchorPos: { top: 0, left: 0 }
  };

  componentDidMount() {
    const {
      getEventsData,
      user
    } = this.props;
    getEventsData(user.uid);
  }

  handleClick = event => {
    setTimeout(() => {
      const target = document.getElementsByClassName('rbc-selected')[0];
      const targetBounding = target.getBoundingClientRect();
      this.setState({
        event,
        anchorEl: true,
        anchorPos: { top: targetBounding.top, left: targetBounding.left }
      });
    }, 200);
  };

  handleClose = () => {
    this.setState({
      anchorEl: false,
    });
  };

  render() {
    const title = brand.name + ' - Calendar';
    const description = brand.desc;
    const { anchorEl, anchorPos, event } = this.state;
    const {
      classes,
      eventData,
      openFrm,
      addEvent,
      discardEvent,
      submit,
      remove,
      closeNotif,
      messageNotif,
      currentUser,
      user
    } = this.props;
    console.log('Calendar :', eventData);
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
        <Notification close={() => closeNotif()} message={messageNotif} />
        <div className={classes.root}>
          <EventCalendar events={eventData.toJS()} handleEventClick={this.handleClick} />
          <DetailEvent
            event={event}
            anchorEl={anchorEl}
            anchorPos={anchorPos}
            close={this.handleClose}
            remove={remove}
            user={user}
          />
          { user.username === currentUser.username && (
            <AddEvent
              openForm={openFrm}
              addEvent={addEvent}
              closeForm={discardEvent}
              submit={submit}
              currentUser={currentUser}
            />
          )}

        </div>
      </div>
    );
  }
}

MusicianCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  eventData: PropTypes.object.isRequired,
  getEventsData: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  discardEvent: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  openFrm: PropTypes.bool.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const reducer = 'calendar';
const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  force: state, // force state from reducer
  eventData: state.getIn([reducer, 'events']),
  openFrm: state.getIn([reducer, 'openFrm']),
  messageNotif: state.getIn([reducer, 'notifMsg']),
  currentUser: state.get(reducerProfile).currentUser,
});

const constDispatchToProps = dispatch => ({
  getEventsData: bindActionCreators(getMusicianEvents, dispatch),
  submit: bindActionCreators(addMusicianEvent, dispatch),
  remove: bindActionCreators(deleteMusicianEvent, dispatch),
  addEvent: () => dispatch(addAction),
  discardEvent: () => dispatch(discardAction),
  closeNotif: () => dispatch(closeNotifAction),
});

const CalendarMapped = connect(
  mapStateToProps,
  constDispatchToProps
)(MusicianCalendar);

export default withStyles(styles)(CalendarMapped);
