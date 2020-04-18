// import { Record } from 'immutable';
import {
  PROFILE_UPDATE,
  RESET_PROFILE
} from '../constants/profileConstants';

export const ProfileState = {
  currentUser: {},
};

export default function profileReducer(state = ProfileState, action = {}) {
  switch (action.type) {
    case PROFILE_UPDATE: {
      const userData = { ...state.currentUser, ...action.currentUser };
      return {
        ...state,
        currentUser: userData
      };
    }
    case RESET_PROFILE:
      console.log('<<<< RESET_PROFILE >>>>');
      return ProfileState;
    default:
      return state;
  }
}
