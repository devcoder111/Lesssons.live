import { all } from 'redux-saga/effects';
import taskSagas from 'enl-containers/SampleFullstackApps//Todo/reducers/todoSagas';
import contactSagas from 'enl-containers/SampleFullstackApps/Contact/reducers/contactSagas';
import emailSagas from 'enl-containers/SampleFullstackApps/Email/reducers/emailSagas';
import authSagas from 'enl-redux/modules/authSagas';
import calendarSagas from 'enl-redux/modules/calendarSagas';
import lessonSagas from 'enl-redux/modules/lessonSagas';
import notificationSagas from 'enl-redux/modules/notificationSagas';
import chatSagas from 'enl-redux/modules/chatSagas';


export default function* sagas() {
    yield all([
        ...authSagas,
        ...contactSagas,
        ...taskSagas,
        ...emailSagas,
        ...calendarSagas,
        ...lessonSagas,
        ...notificationSagas,
        ...chatSagas,
    ]);
}