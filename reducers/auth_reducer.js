import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOADING,
  WELCOME_BACK,
  BIG_PHOTO,
  ONE_SIGNAL,
  SET_GROUP,
  SET_NOM_EXACT,
  DISCONNECT
} from "../actions/types";

const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  email: "",
  photoURL: "",
  bigPhotoUrl: "",
  userId: "",
  group: "",
  loading: false,
  oneSignalMyId: "",
  nomExactLycee: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BIG_PHOTO:
      return { ...state, bigPhotoUrl: action.payload.picture.data.url };
    case LOGIN_SUCCESS:
      return {
        ...state,
        first_name: action.payload.additionalUserInfo.profile.first_name,
        last_name: action.payload.additionalUserInfo.profile.last_name,
        email: action.payload.additionalUserInfo.profile.email,
        photoURL: action.payload.user.photoURL,
        userId: action.payload.user.uid
      };
    case LOGIN_FAIL:
      return { ...state, loading: false };
    case LOADING:
      return { ...state, loading: true };
    case WELCOME_BACK:
      return {
        ...state,
        first_name: action.payload[0].first_name,
        last_name: action.payload[0].last_name,
        email: action.payload[0].email,
        photoURL: action.payload[0].photoURL,
        userId: action.payload[1],
        bigPhotoUrl: action.payload[0].bigPhotoUrl,
        oneSignalMyId: action.payload[0].oneSignalId,
        nomExactLycee: action.payload[0].nom_exact_lycee
      };
    case ONE_SIGNAL:
      return { ...state, oneSignalMyId: action.payload };
    case SET_GROUP:
      return {
        ...state,
        group: action.payload
      };
    case SET_NOM_EXACT:
      return {
        ...state,
        nomExactLycee: action.payload
      };
    case DISCONNECT:
      return INITIAL_STATE;
    default:
      return state;
  }
}
