import {
  FETCH_MESSAGES,
  CREATE_MESSAGE_TEXT,
  MESSAGE_FINISHED,
  CONV_FINISHED
} from "../actions/types";

import _ from "lodash";

const INITIAL_STATE = { messages: [], textMessage: "" };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MESSAGES:
      return { ...state, messages: _.reverse(_.toArray(action.payload)) };
    case CREATE_MESSAGE_TEXT:
      return { ...state, textMessage: action.payload };
    case MESSAGE_FINISHED:
      return { ...state, textMessage: "" };
    case CONV_FINISHED:
      return { messages: [], textMessage: "" };
    default:
      return state;
  }
}
