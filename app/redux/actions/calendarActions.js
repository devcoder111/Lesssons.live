import * as types from '../constants/calendarConstants';

//= ====================================
//  PROFILE
//-------------------------------------

export const addMusicianEvent = (eventData, userUid) => ({
  type: types.ADD_CALENDAR_EVENT,
  eventData,
  userUid
});

export const getMusicianEvents = (userUid) => ({
  type: types.GET_CALENDAR_EVENTS,
  userUid
});

export const deleteMusicianEvent = (eventData, userUid) => ({
  type: types.DELETE_CALENDAR_EVENT,
  eventData,
  userUid
});

export const updateMusicianEventHours = (userUid, availableDateId, availableHours) => ({
  type: types.PAID_EVENT_AVAILABLE_TIME,
  userUid,
  availableDateId,
  availableHours
});
