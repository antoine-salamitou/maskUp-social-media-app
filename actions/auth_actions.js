import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import { firebaseApp } from "../firebase";
import firebase from "firebase";
import { AsyncStorage } from "react-native";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOADING,
  WELCOME_BACK,
  BIG_PHOTO,
  ONE_SIGNAL,
  SET_GROUP,
  DISCONNECT,
  SET_NOM_EXACT
} from "./types";

export const loginFacebook = () => {
  return async dispatch => {
    dispatch({ type: LOADING });
    try {
      await LoginManager.logOut();
      let result = await LoginManager.logInWithReadPermissions([
        "public_profile",
        "email"
      ]);
      if (result.isCancelled) {
        console.log("Whoops!", "You cancelled the sign in.");
        dispatch({ type: LOGIN_FAIL });
      } else {
        let data = await AccessToken.getCurrentAccessToken();
        let credential = await firebaseApp.firebase_.auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        let user = await firebaseApp.firebase_
          .auth()
          .signInAndRetrieveDataWithCredential(credential);
        try {
          const graphRequest = new GraphRequest(
            `/${user.additionalUserInfo.profile.id}`,
            {
              accessToken: data.accessToken,
              parameters: {
                fields: {
                  string: "picture.type(large)"
                }
              }
            },
            (error, result2) => {
              if (error) {
                console.error(error);
              } else {
                dispatch({ type: BIG_PHOTO, payload: result2 });
                firebaseApp
                  .database()
                  .ref(`/users/${user.user.uid}`)
                  .update({
                    bigPhotoUrl: result2.picture.data.url
                  });
              }
            }
          );

          new GraphRequestManager().addRequest(graphRequest).start();
        } catch (error) {
          console.error(error);
        }
        await AsyncStorage.setItem("fb_token", user.user.uid);
        SendDataToFirebase(user);
        //on va mettre dans le state toutes les infos (nom prenom email uid photo)
        dispatch({ type: LOGIN_SUCCESS, payload: user });

        firebaseApp.firebase_
          .database()
          .ref("/one_signal_ids/")
          .child(this.props.userId)
          .once("value", snapshot => {
            if (snapshot.val().oneSignalId) {
              dispatch({
                type: ONE_SIGNAL,
                payload: snapshot.val().oneSignalId
              });
            }
          });
      }
    } catch (error) {
      console.log("Sign in error", error);
      dispatch({ type: LOGIN_FAIL });
    }
  };
};

const _responseInfoCallback = (error: ?Object, result: ?Object) => {
  if (error) {
    alert("Error fetching data: " + error.toString());
  } else {
    alert("Success fetching data: " + result.toString());
  }
};

const SendDataToFirebase = async user => {
  await firebaseApp
    .database()
    .ref(`/users/${user.user.uid}`)
    .set({
      first_name: user.additionalUserInfo.profile.first_name,
      last_name: user.additionalUserInfo.profile.last_name,
      email: user.additionalUserInfo.profile.email,
      photoURL: user.user.photoURL
    });
};

export const fetchInfoUser = () => {
  return async dispatch => {
    try {
      const userId = await AsyncStorage.getItem("fb_token");
      await firebaseApp.firebase_
        .database()
        .ref(`/users/${userId}`)
        .once("value", snapshot => {
          dispatch({ type: WELCOME_BACK, payload: [snapshot.val(), userId] });
        });
    } catch (error) {
      console.log("Sign in error", error);
    }
  };
};

export const oneSignal = oneSignalId => {
  return {
    type: ONE_SIGNAL,
    payload: oneSignalId
  };
};

export const setGroup = nomGroupe => {
  return {
    type: SET_GROUP,
    payload: nomGroupe
  };
};

export const setNomExact = nomExact => {
  return {
    type: SET_NOM_EXACT,
    payload: nomExact
  };
};

export const disconnect = () => {
  return {
    type: DISCONNECT
  };
};
