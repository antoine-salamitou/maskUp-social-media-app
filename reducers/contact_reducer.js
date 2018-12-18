import { FETCH_CONTACT, ADD_CONTACT } from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = { contact: [] };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTACT:
      return { contact: _.toArray(action.payload) };
    case ADD_CONTACT:
      state.contact.push({
        createdAt: Date.now(),
        postKey: action.payload
      });
      return { ...state, contact: state.contact };
    default:
      return state;
  }
}
