import { GO_TO_POST, CREATE_COMMENT_TEXT, COMMENT_FINISHED } from "./types";
import RNFetchBlob from "react-native-fetch-blob";
import { firebaseApp } from "../firebase";
import _ from "lodash";
import Analytics from "appcenter-analytics";
import { Platform, Alert } from "react-native";

export const goToPost = postKey => ({
  type: GO_TO_POST,
  payload: postKey
});

export const createCommentText = (text, postKey) => ({
  type: CREATE_COMMENT_TEXT,
  payload: { text, postKey }
});

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, imageName, mime = "image/jpg") =>
  new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    let uploadBlob = null;
    const imageRef = firebaseApp.firebase_
      .storage()
      .ref("posts")
      .child(imageName);
    fs.readFile(uploadUri, "base64")
      .then(data => Blob.build(data, { type: `${mime};BASE64` }))
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

export const createComment = (
  text,
  group,
  post,
  nbUsers,
  oneSignalIds,
  userId,
  oneSignalId,
  imagePath,
  imageWidth,
  imageHeight,
  color
) => async dispatch => {
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
    dispatch({ type: COMMENT_FINISHED });
    return Alert.alert("Les insultes ne sont pas tolérées");
  }
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
  Analytics.trackEvent("Create Comment", { Category: typePost });
  dispatch({ type: COMMENT_FINISHED });

  if (text || imagePath) {
    try {
      let avatar = "";
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${group}/${post}/users/${userId}`)
        .once("value", snapshot => {
          if (snapshot.val() === null) {
            const nb = nbUsers + 1;
            avatar = `avatar${nb}`;
            firebaseApp.firebase_
              .database()
              .ref(`/posts/${group}/${post}/users/${userId}`)
              .set({ avatar, userId });
            firebaseApp.firebase_
              .database()
              .ref(`/posts/${group}/${post}`)
              .transaction(p => {
                if (p) {
                  p.nbUsers++;
                }
                return p;
              });
          } else {
            avatar = snapshot.val().avatar;
          }
        });

      let updates = {};
      const newCommentKey = firebaseApp.firebase_
        .database()
        .ref(`/posts_comments/${post}`)
        .push().key;
      if (imagePath) {
        const imageName = `${newCommentKey}.jpg`;
        const url = await uploadImage(imagePath, imageName);
        if (!text) {
          const commentData = {
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            nbLikes: 0,
            nbCommentComments: 0,
            commentKey: newCommentKey,
            userId,
            group,
            postKey: post,
            avatar,
            imagePath: url,
            imageWidth,
            imageHeight,
            oneSignalIdCreator: oneSignalId,
            oneSignalIds: {
              [userId]: { userId, oneSignalId }
            }
          };
          updates[`/posts_comments/${post}/${newCommentKey}`] = commentData;
        } else {
          const commentData = {
            text,
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            nbLikes: 0,
            nbCommentComments: 0,
            commentKey: newCommentKey,
            userId,
            group,
            postKey: post,
            avatar,
            imagePath: url,
            imageWidth,
            imageHeight,
            oneSignalIdCreator: oneSignalId,
            oneSignalIds: {
              [userId]: { userId, oneSignalId }
            }
          };
          updates[`/posts_comments/${post}/${newCommentKey}`] = commentData;
        }
      } else {
        const commentData = {
          text,
          createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          nbLikes: 0,
          nbCommentComments: 0,
          commentKey: newCommentKey,
          userId,
          group,
          postKey: post,
          avatar,
          oneSignalIdCreator: oneSignalId,
          oneSignalIds: {
            [userId]: { userId, oneSignalId }
          }
        };
        updates[`/posts_comments/${post}/${newCommentKey}`] = commentData;
      }
      updates[`/posts/${group}/${post}/oneSignalIds/${userId}`] = {
        userId,
        oneSignalId
      };

      firebaseApp.firebase_
        .database()
        .ref(`/posts/${group}/${post}`)
        .transaction(p => {
          if (p) {
            p.nbComments++;
            p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
          }
          return p;
        });
      /*firebaseApp.firebase_
        .database()
        .ref(`/posts/${group}/${post}/users/${userId}`)
        .once("value", snapshot => {
          firebaseApp.firebase_
            .database()
            .ref(`/user_posts/${snapshot.val().userId}/${post}`)
            .transaction(p => {
              if (p) {
                p.nbComments++;
                p.updatedAt =
                  firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
              }
              return p;
            });
        });*/

      const arrayToNotif = [];

      _.toArray(oneSignalIds).forEach(element => {
        if (element.userId !== userId) {
          arrayToNotif.push(element.oneSignalId);
          const newNotificationKey = firebaseApp.firebase_
            .database()
            .ref(`notifications/${element.userId}/${group}`)
            .push().key;
          if (text) {
            const notificationData = {
              avatar,
              text,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              new: true,
              postKey: post,
              notificationKey: newNotificationKey,
              statut: "nouveauCommentaire"
            };
            updates[
              `/notifications/${element.userId}/${group}/${newNotificationKey}`
            ] = notificationData;
          } else {
            const notificationData = {
              avatar,
              text: "Nouvelle image",
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              new: true,
              postKey: post,
              notificationKey: newNotificationKey,
              statut: "nouveauCommentaire"
            };
            updates[
              `/notifications/${element.userId}/${group}/${newNotificationKey}`
            ] = notificationData;
          }
        }
      });
      firebaseApp.firebase_.database().ref().update(updates);
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
          include_player_ids: arrayToNotif,
          headings: { en: "Nouveau commentaire" },
          contents: { en: textNotif },
          data: { postKey: post }
        })
      })
        .then(responseData => {
          //console.log('Push POST:' + JSON.stringify(responseData))
        })
        .catch(errorData => {
          console.log("Push ERROR:" + JSON.stringify(errorData));
        })
        .done();
    } catch (error) {}
  }
};
