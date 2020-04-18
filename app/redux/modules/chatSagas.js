import {
  call, fork, put, takeEvery, all, take
} from 'redux-saga/effects';
import {
  firebaseRsfFirestore
} from '../../firebase';
import {
  SEND_MESSAGE,
  SYNC_MESSAGES
} from '../constants/chatConstants';
import {
  addMessage
} from '../actions/chatActions';

function generateChatId(fromUid, toUid) {
  if (fromUid > toUid) {
    return fromUid + toUid;
  }
  return toUid + fromUid;
}

function* addMessageSaga({ fromUid, toUid, message }) {
  try {
    const chatId = generateChatId(fromUid, toUid);
    yield call(firebaseRsfFirestore.addDocument, 'chats/' + chatId + '/messages/', message);
  } catch (error) {
    console.log('addMessageSaga error :', error);
    // yield put(passwordForgetFailure(error));
  }
}

function* syncChatSaga({ fromUid, toUid }) {
  const chatId = generateChatId(fromUid, toUid);
  const channel = firebaseRsfFirestore.channel('chats/' + chatId + '/messages');
  console.log('syncChatSaga for  chatId:', chatId);

  while (true) {
    const messages = yield take(channel);
    console.log('syncChatSaga messages :', messages, messages.docChanges());
    const newMessages = [];
    messages.docChanges().forEach((item) => {
      const message = item.doc.data();
      console.log('item :', item.doc.id);
      message.id = item.doc.id;
      newMessages.push(message);
    });
    yield put(addMessage(newMessages));
  }
}
//= ====================================
//  WATCHERS
//--------------------------------------

function* chatRootSaga() {
  // yield fork(syncChatSaga);
  yield all([
    takeEvery(SEND_MESSAGE, addMessageSaga),
    takeEvery(SYNC_MESSAGES, syncChatSaga),
  ]);
}

const chatSagas = [
  fork(chatRootSaga),
];

export default chatSagas;
