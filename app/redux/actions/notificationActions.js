import * as types from '../constants/notificationConstants';

//= ====================================
//  PROFILE
//-------------------------------------

export const addNotification = (create_at, sender, receiver, data) => ({
    type: types.ADD_NOTIFICATION,
    create_at,
    sender,
    receiver,
    data
});
export const fetchNotification = (uid) => ({
    type: types.FETCH_NOTIFICATION,
    uid
});