import * as types from '../constants/chatConstants';

//= ====================================
//  CHAT
//-------------------------------------

export const addMessage = (messages) => ({
  type: types.ADD_MESSAGE,
  messages
});
export const syncMessages = (fromUid, toUid) => ({
  type: types.SYNC_MESSAGES,
  fromUid,
  toUid
});
export const sendMessage = (fromUid, toUid, message) => ({
  type: types.SEND_MESSAGE,
  fromUid,
  toUid,
  message
});
export const resetMessages = () => ({
  type: types.RESET_MESSAGES
});
