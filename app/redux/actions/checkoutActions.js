import * as types from '../constants/checkoutConstants';

//= ====================================
//  CHECKOUT PROCESS
//-------------------------------------

export const addNewCard = cards => ({
  type: types.ADD_CREDIT_CARD_SUCCESS,
  cards
});
export const addNewCardRequest = () => ({
  type: types.ADD_CREDIT_CARD_REQUEST
});
