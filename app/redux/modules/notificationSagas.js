import {
    call,
    fork,
    put,
    takeEvery,
    take,
    all
} from 'redux-saga/effects';
import moment from 'moment';
import {
    firebaseRsfFirestore,
    firebaseFirestoreDb
} from '../../firebase';
import {
    ADD_NOTIFICATION,
    FETCH_NOTIFICATION
} from '../constants/notificationConstants';
import {
    addNotification,
    fetchNotification
} from '../actions/notificationActions';
// import * as firebase from 'firebase/app';
// import firebase from 'firebase';
// import '@firebase/firestore'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function* addNotificationSaga({
    create_at,
    sender,
    receiver,
    data
}) {
    try {
        const cuser = firebase.auth().currentUser;

        const notifydata = {
            create_at,
            sender,
            receiver,
            data
        }

        const documentNotification = yield call(firebaseRsfFirestore.addDocument, 'users/' + receiver.uid + '/notification/', notifydata);

    } catch (error) {
        console.log('addNotificationSaga error :', error);
    }

}

function* fetchNotificationSaga(uid) {
    try {
        const user = firebase.auth().currentUser;
        const channel = firebaseRsfFirestore.channel('users/' + user.uid + '/notification/');
        while (true) {
            const notifications = yield take(channel);
            const sources = [];
            notifications.docChanges();
            const notifyDoc = yield call(
                firebaseRsfFirestore.getCollection,
                firebaseFirestoreDb.collection('users/' + user.uid + '/notification').orderBy('create_at', 'desc').limit(10)
            )
            notifyDoc.forEach((querySnapshot) => {
                sources.push(querySnapshot.data());
            });
            yield put({ type: 'EMPTY_NOTIFICATION_SUCCESS', sources })
            yield put({ type: 'FETCH_NOTIFICATION_SUCCESS', sources })
        }
    } catch (error) {
        console.log('fetchNotificationSaga error :', error);
    }

}


function* notificationRootSaga() {

    yield all([
        takeEvery(ADD_NOTIFICATION, addNotificationSaga),
        takeEvery(FETCH_NOTIFICATION, fetchNotificationSaga)
    ]);
}

const notificationSagas = [
    fork(notificationRootSaga),
];

export default notificationSagas;