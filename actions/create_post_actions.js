import { firebaseApp } from "../firebase";
import { Alert, Platform } from "react-native";
import _ from "lodash";
import Analytics from "appcenter-analytics";
import RNFetchBlob from "react-native-fetch-blob";
import { CREATE_POST_TEXT, POST_FINISHED, OPEN_MODAL } from "./types";

export const createPostText = text => {
  return {
    type: CREATE_POST_TEXT,
    payload: text
  };
};

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, imageName, mime = "image/jpg") => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    let uploadBlob = null;
    const imageRef = firebaseApp.firebase_
      .storage()
      .ref("posts")
      .child(imageName);
    fs.readFile(uploadUri, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        resolve(url);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createPost = (
  text,
  group,
  oneSignalId,
  userId,
  imagePath,
  imageHeight,
  imageWidth,
  color
) => async dispatch => {
  try {
    if (
      text &&
      (text.includes(" con ") ||
        text.includes(" conne ") ||
        text.includes("connard") ||
        text.includes("conard") ||
        text.includes("connards") ||
        text.includes("conards") ||
        text.includes(" cons ") ||
        text.includes("connasse") ||
        text.includes("connasses") ||
        text.includes("conasse") ||
        text.includes("connasses") ||
        text.includes("batar") ||
        text.includes("batars") ||
        text.includes("batards") ||
        text.includes("batard") ||
        text.includes("batards") ||
        text.includes("bouffon") ||
        text.includes("bouffons") ||
        text.includes("boufon") ||
        text.includes("boufons") ||
        text.includes("putain") ||
        text.includes("putains") ||
        text.includes("couille") ||
        text.includes("couilles") ||
        text.includes("fdp") ||
        text.includes("FDP") ||
        text.includes("Fdp") ||
        text.includes(" connes ") ||
        text.includes(" cones ") ||
        text.includes("pd") ||
        text.includes("p d") ||
        text.includes("pédé") ||
        text.includes(" pede ") ||
        text.includes(" pute ") ||
        text.includes(" put ") ||
        text.includes("bite") ||
        text.includes("bites") ||
        text.includes("chatte") ||
        text.includes("chattes") ||
        text.includes("fiote") ||
        text.includes("fiotte") ||
        text.includes("connard") ||
        text.includes("encule") ||
        text.includes("fiotes") ||
        text.includes("fiottes") ||
        text.includes("enculé") ||
        text.includes("enculer") ||
        text.includes("encul"))
    ) {
      await dispatch({ type: POST_FINISHED });
      setTimeout(() => {
        return Alert.alert("Les insultes ne sont pas tolérées");
      }, 1000);
    } else {
      let updates = {};

      let typePost = "";
      switch (color) {
        case "yellow":
          typePost = "Lance un débat";
          break;
        case "blue":
          typePost = "Que se passe t'il en ce moment";
          break;
        case "green":
          typePost = "Partage un secret";
          break;

        case "red":
          typePost = "Déclare ton crush";
          break;
        default:
          typePost = "";
      }
      Analytics.trackEvent("Create Post", { Category: typePost });


      if (text || imagePath) {
        const newPostKey = firebaseApp.firebase_
          .database()
          .ref(`/posts/${group}`)
          .push().key;
        await dispatch({ type: POST_FINISHED });
        if (imagePath) {
          const imageName = `${newPostKey}.jpg`;
          const url = await uploadImage(imagePath, imageName);
          if (!text) {
            const postData = {
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              nbLikes: 0,
              nbComments: 0,
              postKey: newPostKey,
              userId,
              nbUsers: 1,
              image: url,
              imageHeight,
              imageWidth,
              color,
              users: {
                [userId]: { avatar: "avatar1", userId }
              },
              avatar: "avatar1",
              oneSignalIdCreator: oneSignalId,
              oneSignalIds: {
                [userId]: { userId, oneSignalId }
              }
            };
            updates[`/posts/${group}/${newPostKey}`] = postData;

            /*await firebaseApp.firebase_
              .database()
              .ref(`/user_posts/${userId}/${newPostKey}`)
              .set({
                createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                nbLikes: 0,
                nbComments: 0,
                postKey: newPostKey,
                userId,
                nbUsers: 1,
                image: url,
                imageHeight,
                imageWidth,
                color,
                users: {
                  [userId]: { avatar: "avatar1", userId }
                },
                avatar: "avatar1",
                oneSignalIdCreator: oneSignalId,
                oneSignalIds: {
                  [userId]: { userId, oneSignalId }
                }
              });*/
          } else {
            const postData = {
              text,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              nbLikes: 0,
              nbComments: 0,
              postKey: newPostKey,
              userId,
              nbUsers: 1,
              image: url,
              color,
              imageHeight,
              imageWidth,
              users: {
                [userId]: { avatar: "avatar1", userId }
              },
              avatar: "avatar1",
              oneSignalIdCreator: oneSignalId,
              oneSignalIds: {
                [userId]: { userId, oneSignalId }
              }
            };
            updates[`/posts/${group}/${newPostKey}`] = postData;
            /*await firebaseApp.firebase_
              .database()
              .ref(`/user_posts/${userId}/${newPostKey}`)
              .set({
                text,
                createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                nbLikes: 0,
                nbComments: 0,
                postKey: newPostKey,
                userId,
                nbUsers: 1,
                image: url,
                imageHeight,
                color,
                imageWidth,
                users: {
                  [userId]: { avatar: "avatar1", userId }
                },
                avatar: "avatar1",
                oneSignalIdCreator: oneSignalId,
                oneSignalIds: {
                  [userId]: { userId, oneSignalId }
                }
              });*/
          }
        } else {
          const postData = {
            text,
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            nbLikes: 0,
            nbComments: 0,
            postKey: newPostKey,
            userId,
            color,
            nbUsers: 1,
            users: {
              [userId]: { avatar: "avatar1", userId }
            },
            avatar: "avatar1",
            oneSignalIdCreator: oneSignalId,
            oneSignalIds: {
              [userId]: { userId, oneSignalId }
            }
          };

          updates[`/posts/${group}/${newPostKey}`] = postData;

          /*await firebaseApp.firebase_
            .database()
            .ref(`/user_posts/${userId}/${newPostKey}`)
            .set({
              text,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              nbLikes: 0,
              nbComments: 0,
              postKey: newPostKey,
              userId,
              color,
              nbUsers: 1,
              users: {
                [userId]: { avatar: "avatar1", userId }
              },
              avatar: "avatar1",
              oneSignalIdCreator: oneSignalId,
              oneSignalIds: {
                [userId]: { userId, oneSignalId }
              }
            });*/
        }

        const array = [];

        await firebaseApp.firebase_
          .database()
          .ref(`group/${group}`)
          .once("value", async snapshot => {
            await _.toArray(snapshot.val()).forEach(element => {
              if (element.userId !== userId) {
                array.push(element.oneSignalId);
                if (text) {
                  const newNotificationKey = firebaseApp.firebase_
                    .database()
                    .ref(`notifications/${element.userId}/${group}`)
                    .push().key;
                  const notificationData = {
                    avatar: "avatar1",
                    text,
                    createdAt:
                      firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                    new: true,
                    postKey: newPostKey,
                    notificationKey: newNotificationKey,
                    statut: "nouveauPost"
                  };

                  updates[
                    `/notifications/${
                      element.userId
                    }/${group}/${newNotificationKey}`
                  ] = notificationData;
                } else {
                  const newNotificationKey = firebaseApp.firebase_
                    .database()
                    .ref(`notifications/${element.userId}/${group}`)
                    .push().key;
                  const notificationData = {
                    avatar: "avatar1",
                    text: "Nouvelle image",
                    createdAt:
                      firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
                    new: true,
                    postKey: newPostKey,
                    notificationKey: newNotificationKey,
                    statut: "nouveauPost"
                  };
                  updates[
                    `/notifications/${
                      element.userId
                    }/${group}/${newNotificationKey}`
                  ] = notificationData;
                }
              }
            });
          });

        firebaseApp.firebase_
          .database()
          .ref()
          .update(updates, error => {
            if (error) {
              Alert.alert("Verifiez votre connection internet");
            }
          });

        let textNotif = "";
        if (!text) {
          textNotif = "Nouvelle image";
        } else {
          textNotif = text;
        }

        fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
            include_player_ids: array,
            headings: { en: "Nouveau post" },
            contents: { en: textNotif },
            data: { postKey: newPostKey }
          })
        })
          .then(responseData => {
            //console.log('Push POST:' + JSON.stringify(responseData))
          })
          .catch(errorData => {
            console.log("Push ERROR:" + JSON.stringify(errorData));
          })
          .done();
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export const openModal = color => {
  return {
    type: OPEN_MODAL,
    payload: color
  };
};

export const postFinished = () => {
  return {
    type: POST_FINISHED
  };
};
