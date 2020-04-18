import {
    call,
    fork,
    put,
    takeEvery,
    all
} from 'redux-saga/effects';
import moment from 'moment';
import {
    firebaseRsfFirestore
} from '../../firebase';
import {
    ADD_CALENDAR_EVENT,
    GET_CALENDAR_EVENTS,
    DELETE_CALENDAR_EVENT,
    PAID_EVENT_AVAILABLE_TIME
} from '../constants/calendarConstants';
import {
    submitAction,
    fetchAction,
    deleteAction
} from '../../actions/CalendarEventActions';


function* addEventSaga({ eventData, userUid }) {
    try {
        const documentData = {};
        console.log('addEventSaga :', eventData);
        for (let [key, value] of eventData) {
            if (moment.isMoment(value)) {
                value = value.toDate();
            }
            documentData[key.toString()] = value;
        }
        const document = yield call(firebaseRsfFirestore.addDocument, 'users/' + userUid + '/available.dates/', documentData);
        const eventDataWithId = eventData.set('docId', document.id);
        yield put(submitAction(eventDataWithId));
    } catch (error) {
        console.log('addEventSaga error :', error);
        // yield put(passwordForgetFailure(error));
    }
}

function* getEventsSaga({ userUid }) {
    try {
        const collection = yield call(firebaseRsfFirestore.getCollection, 'users/' + userUid + '/available.dates/');
        const events = [];
        collection.docs.forEach(doc => {
            const event = doc.data();
            const startDate = new Date(1970, 0, 1); // Epoch
            startDate.setSeconds(event.start.seconds);
            const endDate = new Date(1970, 0, 1); // Epoch
            endDate.setSeconds(event.end.seconds);
            event.start = startDate;
            event.end = endDate;
            event.timeStart = startDate;
            event.timeEnd = endDate;
            event.docId = doc.id;
            events.push(event);
        });
        console.log('getEventsSaga :', userUid, events);
        yield put(fetchAction(events));
    } catch (error) {
        console.log('object error:', error);
        // yield put(passwordForgetFailure(error));
    }
}

function* deleteEventSaga({ eventData, userUid }) {
    try {
        console.log('object deleteEventSaga for:', eventData, userUid);
        yield call(firebaseRsfFirestore.deleteDocument, 'users/' + userUid + '/available.dates/' + eventData.docId);
        yield put(deleteAction(eventData));
    } catch (error) {
        console.log('deleteEventSaga error:', error);
        // yield put(passwordForgetFailure(error));
    }
}

function* updateAvailableHoursEventSaga({ userUid, availableDateId, availableHours }) {
    try {
        console.log('object updateAvailableHoursEventSaga for:', userUid, availableDateId, availableHours);
        yield call(firebaseRsfFirestore.setDocument, 'users/' + userUid + '/available.dates/' + availableDateId, { availableHours }, { merge: true });
    } catch (error) {
        console.log('deleteEventSaga error:', error);
        // yield put(passwordForgetFailure(error));
    }
}

//= ====================================
//  WATCHERS
//-------------------------------------

function* calendarRootSaga() {
    yield all([
        takeEvery(ADD_CALENDAR_EVENT, addEventSaga),
        takeEvery(GET_CALENDAR_EVENTS, getEventsSaga),
        takeEvery(DELETE_CALENDAR_EVENT, deleteEventSaga),
        takeEvery(PAID_EVENT_AVAILABLE_TIME, updateAvailableHoursEventSaga),
    ]);
}

const calendarSagas = [
    fork(calendarRootSaga),
];

export default calendarSagas;