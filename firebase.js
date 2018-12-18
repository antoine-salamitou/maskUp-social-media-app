// import and configure firebase
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDrCJ3yxqFRXnWFAHzKVZF1SKh9AZ9gdig',
  authDomain: 'messageapp-c2b57.firebaseapp.com',
  databaseURL: 'https://messageapp-c2b57.firebaseio.com',
  projectId: 'messageapp-c2b57',
  storageBucket: 'messageapp-c2b57.appspot.com',
  messagingSenderId: '371141546954'
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)
