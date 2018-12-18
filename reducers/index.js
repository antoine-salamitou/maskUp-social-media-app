import { combineReducers } from "redux";
import auth from "./auth_reducer";
import createPost from "./createPost_reducer";
import comments from "./comments_reducer";
import createComment from "./create_comment_reducer";
import chat from "./chat_reducer";
import messages from "./messages_reducer";
import contact from "./contact_reducer";
import notification from "./notification_reducer";

export default combineReducers({
  auth,
  createPost,
  comments,
  createComment,
  chat,
  messages,
  contact,
  notification
});
