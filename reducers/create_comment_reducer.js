import { CREATE_COMMENT_TEXT, COMMENT_FINISHED } from "../actions/types";

const INITIAL_STATE = { text: "", postKey: "" };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_COMMENT_TEXT:
      return {
        ...state,
        text: action.payload.text,
        postKey: action.payload.postKey
      };
    case COMMENT_FINISHED:
      return INITIAL_STATE;
    default:
      return state;
  }
}
