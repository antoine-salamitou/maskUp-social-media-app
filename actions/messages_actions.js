import { firebaseApp } from '../firebase';
import {
FETCH_MESSAGES,
CREATE_MESSAGE_TEXT,
MESSAGE_FINISHED,
CONV_FINISHED
} from './types';

export const fetchMessages = (chatKey) => async (dispatch) => {
    try {
      await firebaseApp.firebase_.database().ref(`/messages/${chatKey}`).on('value', snapshot => {
              dispatch({ type: FETCH_MESSAGES, payload: snapshot.val() });
      });
    } catch (error) {
      console.log('Error', error);
    }
};

export const createMessageText = (text) => {
	return {
		type: CREATE_MESSAGE_TEXT, payload: text
	};
};

export const messageFinished = () => {
	return {
		type: MESSAGE_FINISHED
	};
};

export const convFinished = () => {
	return {
		type: CONV_FINISHED
	};
};
