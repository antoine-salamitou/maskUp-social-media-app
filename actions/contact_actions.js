import { firebaseApp } from '../firebase';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import {
FETCH_CONTACT,
ADD_CONTACT
} from './types';

export const fetchContact = () => async (dispatch) => {
  const userId = await AsyncStorage.getItem('fb_token');
  const fb = firebaseApp.firebase_.database().ref(`/contact/${userId}`);
  await fb.once('value', async snapshot => {
    dispatch({ type: FETCH_CONTACT, payload: snapshot.val() });
  });
};

export const addContact = (postKey) => {
	return {
		type: ADD_CONTACT, payload: postKey
	};
};
