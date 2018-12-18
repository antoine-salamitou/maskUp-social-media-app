import { GO_TO_POST } from "../actions/types";

const INITIAL_STATE = { post: "" };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GO_TO_POST:
      return { post: action.payload };
    default:
      return state;
  }
}
