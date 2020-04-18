// import { Record } from 'immutable';
import {
  ADD_CREDIT_CARD_SUCCESS,
  ADD_CREDIT_CARD_REQUEST
} from '../constants/checkoutConstants';

export const CardsState = {
  cards: []
};

export default function checkoutReducer(state = CardsState, action = {}) {
  switch (action.type) {
    case ADD_CREDIT_CARD_SUCCESS:
      return {
        ...state,
        cards: action.cards,
        openCardForm: false
      };
    case ADD_CREDIT_CARD_REQUEST:
      console.log('ADD_CREDIT_CARD_REQUEST :',);
      return {
        ...state,
        openCardForm: true,
        message: null
      };
    default:
      return state;
  }
}
