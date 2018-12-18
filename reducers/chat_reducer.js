import {
  GO_TO_CHAT,
  END_CHAT,
  NB_MESSAGES,
  START_CHAT
} from "../actions/types";

const INITIAL_STATE = { chatKey: "", nbMessages: 0, chatOpened: false };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GO_TO_CHAT:
      return { ...state, chatKey: action.payload };
    case END_CHAT:
      return { ...state, chatOpened: false };
    case START_CHAT:
      return { ...state, chatOpened: true };
    case NB_MESSAGES:
      return { ...state, nbMessages: action.payload };
    default:
      return state;
  }
}
