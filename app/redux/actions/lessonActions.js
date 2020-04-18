import * as types from '../constants/lessonConstants';

//= ====================================
//  PROFILE
//-------------------------------------

export const addLesson = (user, musician, start, end) => ({
  type: types.ADD_LESSON,
  user,
  musician,
  start,
  end
});
