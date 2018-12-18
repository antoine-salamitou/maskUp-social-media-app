import { CREATE_POST_TEXT, POST_FINISHED, OPEN_MODAL } from "../actions/types";

const INITIAL_STATE = { text: "", modal: false, color: "" };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_POST_TEXT:
      return { ...state, text: action.payload };
    case POST_FINISHED:
      return INITIAL_STATE;
    case OPEN_MODAL:
      return { modal: true, color: action.payload };
    default:
      return state;
  }
}
