import { firebaseApp } from '../firebase';
import _ from 'lodash';
import Analytics from "appcenter-analytics";


export const likePost = (group, post, oneSignalIdCreator, oneSignalId, userId, color) => async () => {
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
  Analytics.trackEvent("Like Post", { Category: typePost });
    await firebaseApp.firebase_.database().ref(`/posts/${group}/${post}`).transaction(
      (p) => {
        if (p) {
          p.nbLikes++
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
        }
        return p;
      }
    );
    /*firebaseApp.firebase_.database().ref(`/posts/${group}/${post}`).once('value', snapshot => {
     firebaseApp.firebase_.database().ref(`/user_posts/${snapshot.val().userId}/${post}`).transaction(
        (p) => {
          if (p) {
            p.nbLikes++
            p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
          }
          return p;
        }
      );
      firebaseApp.firebase_.database().ref(`/user_posts/${snapshot.val().userId}/${post}/likes/${userId}`).set({
        userId,
        createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
      });
    })*/


    firebaseApp.firebase_.database().ref(`/posts/${group}/${post}/likes/${userId}`).set({
      userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    });

    /*if (oneSignalId !== oneSignalIdCreator) {
      fetch('https://onesignal.com/api/v1/notifications',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                  },
                  body: JSON.stringify(
                  {
                    app_id: '3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05',
                    include_player_ids: [oneSignalIdCreator],
                    headings: { 'en': 'Nouveau like'},
                  })
                }
        ).then((responseData) => {
                  //console.log('Push POST:' + JSON.stringify(responseData))
        }).catch((errorData) => {
            console.log('Push ERROR:' + JSON.stringify(errorData))
        }).done();
    }*/
};

export const dislikePost = (group, post, oneSignalIdCreator, oneSignalId, userId, color) => async () => {
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
    Analytics.trackEvent("Dislike Post", { Category: typePost });

    await firebaseApp.firebase_.database().ref(`/posts/${group}/${post}`).transaction(
      (p) => {
        if (p) {
          p.nbLikes--
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
        }
        return p;
      }
    );
    /*firebaseApp.firebase_.database().ref(`/posts/${group}/${post}`).once('value', snapshot => {
     firebaseApp.firebase_.database().ref(`/user_posts/${snapshot.val().userId}/${post}`).transaction(
        (p) => {
          if (p) {
            p.nbLikes--
            p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
          }
          return p;
        }
      );
    })
*/

    firebaseApp.firebase_.database().ref(`/posts/${group}/${post}/dislikes/${userId}`).set({
      userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    });

    /*if (oneSignalId !== oneSignalIdCreator) {
      fetch('https://onesignal.com/api/v1/notifications',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                  },
                  body: JSON.stringify(
                  {
                    app_id: '3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05',
                    include_player_ids: [oneSignalIdCreator],
                    headings: { 'en': 'Nouveau like'},
                  })
                }
        ).then((responseData) => {
                  //console.log('Push POST:' + JSON.stringify(responseData))
        }).catch((errorData) => {
            console.log('Push ERROR:' + JSON.stringify(errorData))
        }).done();
    }*/
};


export const likeComment = (post, group, comment, oneSignalIdCreator, oneSignalId, userId) => async () => {
Analytics.trackEvent("Like Comment");
  const updates = {};
    await firebaseApp.firebase_.database().ref(`/posts_comments/${post}/${comment}`).transaction(
      (p) => {
        if (p) {
          p.nbLikes++
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
        }
        return p;
      }
    );
    await firebaseApp.firebase_.database().ref(`/posts_comments/${post}/${comment}/likes/${userId}`).set({
      userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    });

  updates[`/posts/${group}/${post}/updatedAt`] = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    firebaseApp.firebase_.database().ref().update(updates);

  /*  if (oneSignalId !== oneSignalIdCreator) {
    fetch('https://onesignal.com/api/v1/notifications',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(
                {
                  app_id: '3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05',
                  include_player_ids: [oneSignalIdCreator],
                  headings: { 'en': 'Nouveau like' },
                })
              }
      ).then((responseData) => {
                //console.log('Push POST:' + JSON.stringify(responseData))
      }).catch((errorData) => {
          console.log('Push ERROR:' + JSON.stringify(errorData))
      }).done()
    }*/
};

export const dislikeComment = (post, group, comment, oneSignalIdCreator, oneSignalId, userId) => async () => {
Analytics.trackEvent("Dislike Comment");
  const updates = {};
    await firebaseApp.firebase_.database().ref(`/posts_comments/${post}/${comment}`).transaction(
      (p) => {
        if (p) {
          p.nbLikes--
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP
        }
        return p;
      }
    );
    await firebaseApp.firebase_.database().ref(`/posts_comments/${post}/${comment}/dislikes/${userId}`).set({
      userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    });

  updates[`/posts/${group}/${post}/updatedAt`] = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    firebaseApp.firebase_.database().ref().update(updates);

    /*if (oneSignalId !== oneSignalIdCreator) {
    fetch('https://onesignal.com/api/v1/notifications',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(
                {
                  app_id: '3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05',
                  include_player_ids: [oneSignalIdCreator],
                  headings: { 'en': 'Nouveau dislike.' },
                })
              }
      ).then((responseData) => {
                //console.log('Push POST:' + JSON.stringify(responseData))
      }).catch((errorData) => {
          console.log('Push ERROR:' + JSON.stringify(errorData))
      }).done()
    }*/
};
