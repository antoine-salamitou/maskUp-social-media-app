import { GO_TO_CHAT, END_CHAT, NB_MESSAGES, START_CHAT } from "./types";

export const goToChat = chatKey => {
  return {
    type: GO_TO_CHAT,
    payload: chatKey
  };
};

export const endChat = () => {
  return {
    type: END_CHAT
  };
};

export const startChat = () => {
  return {
    type: START_CHAT
  };
};

export const newMessages = nbMessages => {
  return {
    type: NB_MESSAGES,
    payload: nbMessages
  };
};
