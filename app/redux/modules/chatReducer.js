// import { Record } from 'immutable';
import {
  ADD_MESSAGE,
  RESET_MESSAGES
} from '../constants/chatConstants';

export const ChatState = {
  messages: [],
};

export default function chatReducer(state = ChatState, action = {}) {
  switch (action.type) {
    case ADD_MESSAGE:
      const messages = [...state.messages, ...action.messages];
      return {
        ...state,
        messages
      };
    case RESET_MESSAGES:
      return ChatState;
    default:
      return state;
  }
}
