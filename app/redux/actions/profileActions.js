import * as types from '../constants/profileConstants';

//= ====================================
//  PROFILE
//-------------------------------------

export const profileUpdate = currentUser => ({
  type: types.PROFILE_UPDATE,
  currentUser
});
export const profileReset = () => ({
  type: types.RESET_PROFILE
});
