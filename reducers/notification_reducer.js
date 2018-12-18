import {
  NEW_MESSAGE_NOTIF,
  MINUS_MESSAGE_NOTIF,
  NB_PROFILE_NOTIF,
  RESTART_MESSAGE_NOTIFICATION,
  RESTART_PROFILE_NOTIFICATION
} from "../actions/types";

const INITIAL_STATE = { notificationCount: 0, profileNotificationCount: 0 };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case NEW_MESSAGE_NOTIF:
      return { ...state, notificationCount: state.notificationCount + 1 };
    case MINUS_MESSAGE_NOTIF:
      return { ...state, notificationCount: state.notificationCount - 1 };
    case NB_PROFILE_NOTIF:
      return { ...state, profileNotificationCount: action.payload };
    case RESTART_MESSAGE_NOTIFICATION:
      return { ...state, notificationCount: 0 };
    case RESTART_PROFILE_NOTIFICATION:
      return { ...state, profileNotificationCount: 0 };
    default:
      return state;
  }
}
