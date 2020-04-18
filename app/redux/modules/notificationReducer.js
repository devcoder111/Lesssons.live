// import { Record } from 'immutable';
import { fromJS, List, Map } from 'immutable';
import {
    ADD_NOTIFICATION,
    FETCH_NOTIFICATION
} from '../constants/notificationConstants';

export const NotificationState = {
    notifications: [],
};

export default function notificationReducer(state = NotificationState, action = {}) {

    switch (action.type) {
        case "ADD_NOTIFICATION_SUCCESS":
            let notifications = [...state.notifications, {...action.notifications}];
            return {
                ...state,
                notifications
            };
        case "FETCH_NOTIFICATION_SUCCESS":
             notifications = [...state.notifications, ...action.sources];
            return {
                ...state,
                notifications
            };
        case "EMPTY_NOTIFICATION_SUCCESS":
             notifications = [];
            return {
                ...state,
                notifications
            };
        default:
            return state;
    }
}

