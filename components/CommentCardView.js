import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import Analytics from "appcenter-analytics";
import _ from "lodash";
import { firebaseApp } from "../firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import "moment/locale/fr";
import moment from "moment";
import { connect } from "react-redux";
import Lightbox from "react-native-lightbox";
import * as actions from "../actions";
import CommentComments from "./CommmentComments";
import { Confirm } from "./Confirm";

const IMAGES = [
  require(`../assets/images/avatar1.png`),
  require(`../assets/images/avatar2.png`),
  require(`../assets/images/avatar3.png`),
  require(`../assets/images/avatar4.png`),
  require(`../assets/images/avatar5.png`),
  require(`../assets/images/avatar6.png`),
  require(`../assets/images/avatar7.png`),
  require(`../assets/images/avatar8.png`)
];

class CommentCardView extends Component {
  state = {
    text: "",
    showTextInput: false,
    showCommentComments: false,
    liked: false,
    disliked: false,
    showModal: false,
    confirm: "",
    contact: false
  };

  componentWillMount() {
    this.testLike();
    this.testContact();
    this.testDislike();
  }

  componentWillReceiveProps() {
    this.testLike();
    this.testDislike();
  }

  testContact = async () => {
    if (this.props.data.postData.userId !== this.props.userId) {
      this.setState({ contact: true });
    }
  };

  testLike = async () => {
    const isPresent = _
      .toArray(this.props.data.postData.likes)
      .some(element => {
        return element.userId === this.props.userId;
      });
    if (isPresent) {
      await this.setState({ liked: true });
    }
  };

  testDislike = async () => {
    const isPresent = _
      .toArray(this.props.data.postData.dislikes)
      .some(element => {
        return element.userId === this.props.userId;
      });
    if (isPresent) {
      await this.setState({ disliked: true });
    }
  };

  renderItemCommentsComments = ({ item }) => {
    return item.nbLikes > -3 ? (
      <CommentComments data={item} tintColor={this.props.tintColor} />
    ) : null;
  };

  renderCommentsComments = () => {
    if (this.props.data.postData.commentsComment) {
      if (this.state.showCommentComments) {
        return (
          <View style={{ flex: 1, marginBottom: 30 }}>
            <FlatList
              data={_.toArray(this.props.data.postData.commentsComment)}
              extraData={this.state}
              keyExtractor={item => item.commentsCommentKey}
              renderItem={this.renderItemCommentsComments}
              scrollEnabled={false}
            />
          </View>
        );
      }
      return (
        <TouchableOpacity
          style={{ marginLeft: 100, marginBottom: 20 }}
          onPress={() => this.setState({ showCommentComments: true })}
        >
          <Text style={{ fontSize: 25 }}>...</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  createCommentCommentText = text => {
    this.setState({ text });
  };

  createCommentComment = async (
    group,
    postKey,
    commentKey,
    oneSignalIds,
    oneSignalId
  ) => {
    if (
      this.state.text &&
      (this.state.text.includes(" con ") ||
        this.state.text.includes(" conne ") ||
        this.state.text.includes("connard") ||
        this.state.text.includes("conard") ||
        this.state.text.includes("connards") ||
        this.state.text.includes("conards") ||
        this.state.text.includes(" cons ") ||
        this.state.text.includes("connasse") ||
        this.state.text.includes("connasses") ||
        this.state.text.includes("conasse") ||
        this.state.text.includes("connasses") ||
        this.state.text.includes("batar") ||
        this.state.text.includes("batars") ||
        this.state.text.includes("batards") ||
        this.state.text.includes("batard") ||
        this.state.text.includes("batards") ||
        this.state.text.includes("bouffon") ||
        this.state.text.includes("bouffons") ||
        this.state.text.includes("boufon") ||
        this.state.text.includes("boufons") ||
        this.state.text.includes("putain") ||
        this.state.text.includes("putains") ||
        this.state.text.includes("couille") ||
        this.state.text.includes("couilles") ||
        this.state.text.includes("fdp") ||
        this.state.text.includes("FDP") ||
        this.state.text.includes("Fdp") ||
        this.state.text.includes(" connes ") ||
        this.state.text.includes(" cones ") ||
        this.state.text.includes("pd") ||
        this.state.text.includes("p d") ||
        this.state.text.includes("pédé") ||
        this.state.text.includes(" pede ") ||
        this.state.text.includes(" pute ") ||
        this.state.text.includes(" put ") ||
        this.state.text.includes("bite") ||
        this.state.text.includes("bites") ||
        this.state.text.includes("chatte") ||
        this.state.text.includes("chattes") ||
        this.state.text.includes("fiote") ||
        this.state.text.includes("fiotte") ||
        this.state.text.includes("connard") ||
        this.state.text.includes("encule") ||
        this.state.text.includes("fiotes") ||
        this.state.text.includes("fiottes") ||
        this.state.text.includes("enculé") ||
        this.state.text.includes("enculer") ||
        this.state.text.includes("encul"))
    ) {
      this.setState({ text: "", showTextInput: false });
      Alert.alert("Les insultes ne sont pas tolérées");
    } else {
      Analytics.trackEvent("Create Comment Comment");
      const updates = {};
      const text = this.state.text;
      this.setState({ text: "", showTextInput: false });
      let avatar = "";
      const userId = await AsyncStorage.getItem("fb_token");
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${group}/${postKey}/users/${userId}`)
        .once("value", snapshot => {
          if (snapshot.val() === null) {
            let nbUsers = 0;
            firebaseApp.firebase_
              .database()
              .ref(`/posts/${group}/${postKey}`)
              .once("value", snapshot2 => {
                nbUsers = snapshot2.val().nbUsers;
              });
            avatar = `avatar${nbUsers + 1}`;
            updates[`/posts/${group}/${postKey}/users/${userId}`] = {
              avatar,
              userId
            };
            firebaseApp.firebase_
              .database()
              .ref(`/posts/${group}/${postKey}`)
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
      const commentsCommentKey = await firebaseApp.firebase_
        .database()
        .ref(`/posts_comments/${postKey}/${commentKey}/commentsComment`)
        .push().key;
      updates[
        `/posts_comments/${postKey}/${commentKey}/commentsComment/${commentsCommentKey}`
      ] = {
        text,
        createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
        updatedAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
        nbLikes: 0,
        commentKey,
        userId,
        group,
        postKey,
        commentsCommentKey,
        avatar
      };

      //nb comment + 1
      updates[`/posts/${group}/${postKey}/updatedAt`] =
        firebaseApp.firebase_.database.ServerValue.TIMESTAMP;

      await firebaseApp.firebase_
        .database()
        .ref(`/posts_comments/${postKey}/${commentKey}`)
        .transaction(p => {
          if (p) {
            p.nbCommentComments++;
            p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
          }
          return p;
        });

      const arrayToNotif = [];
      _.toArray(oneSignalIds).forEach(async element => {
        if (element.oneSignalId !== oneSignalId) {
          arrayToNotif.push(element.oneSignalId);

          const newNotificationKey = await firebaseApp.firebase_
            .database()
            .ref(`notifications/${element.userId}/${this.props.group}`)
            .push().key;
          updates[
            `/notifications/${element.userId}/${
              this.props.group
            }/${newNotificationKey}`
          ] = {
            avatar,
            text,
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            new: true,
            postKey,
            notificationKey: newNotificationKey,
            statut: "nouveauCommentaireCommentaire"
          };
        }
      });

      fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
          include_player_ids: arrayToNotif,
          headings: { en: "Réponse à votre commentaire" },
          contents: { en: text },
          data: { postKey }
        })
      })
        .then(responseData => {
          //console.log('Push POST:' + JSON.stringify(responseData))
        })
        .catch(errorData => {
          console.log("Push ERROR:" + JSON.stringify(errorData));
        })
        .done();
      updates[
        `/posts_comments/${postKey}/${commentKey}/oneSignalIds/${userId}`
      ] = { userId, oneSignalId };

      firebaseApp.firebase_
        .database()
        .ref()
        .update(updates);
    }
  };

  writeCommentComment = () => {
    return !this.state.showTextInput ? null : (
      <View
        style={{
          padding: 16,
          marginBottom: 5,
          flexDirection: "row"
        }}
      >
        <TextInput
          multiline
          style={styles.textInput}
          keyboardShouldPersistTaps="handled"
          placeholderTextColor={"gray"}
          placeholder={"Answer"}
          value={this.state.text}
          onChangeText={text => this.createCommentCommentText(text)}
        />

        <TouchableOpacity
          onPress={() =>
            this.createCommentComment(
              this.props.group,
              this.props.postKey,
              this.props.data.postData.commentKey,
              this.props.data.postData.oneSignalIds,
              this.props.oneSignalId
            )
          }
        >
          <Image
            style={styles.send}
            source={require("../assets/icons/send2.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  likeReact = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ marginLeft: 20 }}>
          {this.state.liked ? (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.likesReact}>unLike</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                this.props.likeComment(
                  this.props.data.postData.postKey,
                  this.props.group,
                  this.props.data.postData.commentKey,
                  this.props.data.postData.oneSignalIdCreator,
                  this.props.oneSignalId,
                  this.props.userId
                )
              }
            >
              <Text style={styles.likesReact}>Like</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({ showTextInput: true, showCommentComments: true })
            }
          >
            <Text style={styles.likesReact}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  likeComment = () => {
    this.setState({ liked: true });
    this.props.likeComment(
      this.props.data.postData.postKey,
      this.props.group,
      this.props.data.postData.commentKey,
      this.props.data.postData.oneSignalIdCreator,
      this.props.oneSignalId,
      this.props.userId
    );
  };

  dislikeComment = () => {
    this.setState({ disliked: true });
    this.props.dislikeComment(
      this.props.data.postData.postKey,
      this.props.group,
      this.props.data.postData.commentKey,
      this.props.data.postData.oneSignalIdCreator,
      this.props.oneSignalId,
      this.props.userId
    );
  };

  liked = () => {
    return (
      <Image
        style={{
          height: 24,
          width: 24,
          marginTop: 10,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/like.png")}
      />
    );
  };

  unLiked = () => {
    return this.state.disliked ? (
      <Image
        style={{
          height: 24,
          width: 24,
          marginTop: 10,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/like.png")}
      />
    ) : (
      <TouchableOpacity onPress={() => this.likeComment()}>
        <Image
          style={{
            height: 24,
            width: 24,
            marginTop: 10,
            tintColor: this.props.tintColor
          }}
          source={require("../assets/icons/like.png")}
        />
      </TouchableOpacity>
    );
  };

  disliked = () => {
    return (
      <Image
        style={{
          height: 24,
          width: 24,
          marginTop: 10,
          marginRight: 10,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/dislike.png")}
      />
    );
  };

  unDisliked = () => {
    return this.state.liked ? (
      <Image
        style={{
          height: 24,
          width: 24,
          marginTop: 10,
          marginRight: 10,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/dislike.png")}
      />
    ) : (
      <TouchableOpacity onPress={() => this.dislikeComment()}>
        <Image
          style={{
            height: 24,
            width: 24,
            marginTop: 10,
            marginRight: 10,
            tintColor: this.props.tintColor
          }}
          source={require("../assets/icons/dislike.png")}
        />
      </TouchableOpacity>
    );
  };

  onDecline = () => {
    this.setState({ showModal: false });
  };

  onAccept = async () => {
    if (this.state.confirm === "Voulez vous supprimer votre commentaire?") {
      firebaseApp.firebase_
        .database()
        .ref(
          `/posts_comments/${this.props.data.postData.postKey}/${
            this.props.data.postData.commentKey
          }`
        )
        .remove();
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${this.props.postKey}`)
        .transaction(p => {
          if (p) {
            p.nbComments--;
            p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
          }
          return p;
        });
      this.setState({ showModal: false });
    } else {
      if (this.props.data.postData.text) {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.data.postData.postKey}`)
          .set({
            signalement: this.props.data.postData.postKey,
            text: this.props.data.postData.text,
            type: "com"
          });
      } else {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.data.postData.postKey}`)
          .set({
            signalement: this.props.data.postData.postKey,
            text: "image",
            type: "com"
          });
      }
      await this.setState({ showModal: false });

      setTimeout(() => {
        Alert.alert(
          "Merci de nous aider à rendre Mask un endroit sympathique!"
        );
      }, 300);
    }
  };

  eraseData = async () => {
    if (this.state.contact === false) {
      await this.setState({
        confirm: "Voulez vous supprimer votre commentaire?"
      });
    } else {
      await this.setState({ confirm: "Voulez vous signaler ce post?" });
    }
    this.setState({ showModal: true });
  };

  createConversation = async (
    idComment,
    userIdComment,
    avatarComment,
    userIdContact,
    postKey
  ) => {
    const isPresent = this.props.contact.some(element => {
      return element.postKey === postKey + userIdComment;
    });
    if (isPresent) {
      return Alert.alert(
        "Attention",
        "Vous avez déjà contacté cette personne pour ce post !"
      );
    }
    //on fetch si l'user a deja commenté ou si on doit créer un nouvel avatar
    let avatarContact = "";
    firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.group}/${this.props.postKey}`)
      .once("value", snapshot => {
        if (snapshot.val().users[this.props.userId]) {
          avatarContact = snapshot.val().users[this.props.userId].avatar;
        } else {
          avatarContact = `avatar${snapshot.val().nbUsers + 1}`;
          firebaseApp.firebase_
            .database()
            .ref(
              `/posts/${this.props.group}/${
                this.props.postKey
              }/users/${userIdContact}`
            )
            .set({ avatar: avatarContact, userId: userIdContact });
          firebaseApp.firebase_
            .database()
            .ref(`/posts/${this.props.group}/${this.props.postKey}`)
            .transaction(p => {
              if (p) {
                p.nbUsers++;
              }
              return p;
            });
        }
      });

    let content = {};
    const updates = {};
    const textComment = this.props.data.postData.text
      ? this.props.data.postData.text
      : "image";
    const newConvKey = firebaseApp.firebase_
      .database()
      .ref("user_conversations")
      .push().key;
    await firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.group}/${this.props.postKey}`)
      .once("value", async snapshot => {
        const messageKey = await firebaseApp.firebase_
          .database()
          .ref(`messages/${newConvKey}`)
          .push().key;

        if (snapshot.val().image) {
          if (snapshot.val().text) {
            updates[`messages/${newConvKey}/${messageKey}`] = {
              image: snapshot.val().image,
              text: snapshot.val().text,
              user: {
                _id: snapshot.val().userId
              },
              firstMessage: true,
              textComment,
              avatarComment: this.props.data.postData.avatar,
              commentId: this.props.data.postData.commentKey,
              nbLikes: snapshot.val().nbLikes,
              nbComments: snapshot.val().nbComments,
              createdAt: snapshot.val().createdAt,
              chatKey: newConvKey,
              messageKey,
              avatar: snapshot.val().avatar,
              name: "Anonyme"
            };
            content = {
              visible: "non_visible_" + new Date().getTime(),
              chatKey: newConvKey,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageDate:
                firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageText: "",
              postText: snapshot.val().text,
              postImage: snapshot.val().image,
              newMessages: 0,
              users: {
                user1: userIdComment,
                user2: userIdContact
              },
              postKey: snapshot.val().postKey,
              avatar: {
                [userIdComment]: {
                  avatar: avatarComment,
                  userId: userIdComment
                },
                [userIdContact]: {
                  //if comment created => fetch avatar else create avatar
                  avatar: avatarContact,
                  userId: userIdContact
                }
              },
              name: {
                [userIdComment]: {
                  firstName: "Anonyme",
                  lastName: "",
                  userId: userIdComment
                },
                [userIdContact]: {
                  //if comment created => fetch avatar else create avatar
                  firstName: "Anonyme",
                  lastName: "",
                  userId: userIdContact
                }
              }
            };
          } else {
            updates[`messages/${newConvKey}/${messageKey}`] = {
              image: snapshot.val().image,
              user: {
                _id: snapshot.val().userId
              },
              firstMessage: true,
              nbLikes: snapshot.val().nbLikes,
              nbComments: snapshot.val().nbComments,
              textComment,
              avatarComment: this.props.data.postData.avatar,
              commentId: this.props.data.postData.commentKey,
              createdAt: snapshot.val().createdAt,
              chatKey: newConvKey,
              messageKey,
              avatar: snapshot.val().avatar,
              name: "Anonyme"
            };
            content = {
              visible: "non_visible_" + new Date().getTime(),
              chatKey: newConvKey,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageDate:
                firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageText: "",
              postImage: snapshot.val().image,
              postText: "Image",
              newMessages: 0,
              users: {
                user1: userIdComment,
                user2: userIdContact
              },
              postKey: snapshot.val().postKey,
              avatar: {
                [userIdComment]: {
                  avatar: avatarComment,
                  userId: userIdComment
                },
                [userIdContact]: {
                  //if comment created => fetch avatar else create avatar
                  avatar: avatarContact,
                  userId: userIdContact
                }
              },
              name: {
                [userIdComment]: {
                  firstName: "Anonyme",
                  lastName: "",
                  userId: userIdComment
                },
                [userIdContact]: {
                  //if comment created => fetch avatar else create avatar
                  firstName: "Anonyme",
                  lastName: "",
                  userId: userIdContact
                }
              }
            };
          }
        } else {
          updates[`messages/${newConvKey}/${messageKey}`] = {
            text: snapshot.val().text,
            user: {
              _id: snapshot.val().userId
            },
            firstMessage: true,
            nbLikes: snapshot.val().nbLikes,
            textComment,
            avatarComment: this.props.data.postData.avatar,
            commentId: this.props.data.postData.commentKey,
            nbComments: snapshot.val().nbComments,
            createdAt: snapshot.val().createdAt,
            chatKey: newConvKey,
            messageKey,
            avatar: snapshot.val().avatar,
            name: "Anonyme"
          };

          content = {
            visible: "non_visible_" + new Date().getTime(),
            chatKey: newConvKey,
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            lastMessageDate:
              firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            lastMessageText: "",
            postText: snapshot.val().text,
            newMessages: 0,
            users: {
              user1: userIdComment,
              user2: userIdContact
            },
            postKey: snapshot.val().postKey,
            avatar: {
              [userIdComment]: {
                avatar: avatarComment,
                userId: userIdComment
              },
              [userIdContact]: {
                //if comment created => fetch avatar else create avatar
                avatar: avatarContact,
                userId: userIdContact
              }
            },
            name: {
              [userIdComment]: {
                firstName: "Anonyme",
                lastName: "",
                userId: userIdComment
              },
              [userIdContact]: {
                //if comment created => fetch avatar else create avatar
                firstName: "Anonyme",
                lastName: "",
                userId: userIdContact
              }
            }
          };
        }
      });
    updates[`/user_conversations/${userIdComment}/${newConvKey}`] = content;
    updates[`/user_conversations/${userIdContact}/${newConvKey}`] = content;
    await firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);

    this.props.goToChat(newConvKey);
    this.props.navMessages();
  };

  render() {
    const avatarNb = this.props.data.postData.avatar
      ? this.props.data.postData.avatar.slice(6)
      : null;
    return (
      <View style={{ marginBottom: 30 }}>
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref;
          }}
        >
          <View style={styles.comment}>
            <View style={{ flexDirection: "row" }}>
              {this.props.data.postData.userId === this.props.userId ? (
                <Image
                  style={[styles.profile_comment, styles.me]}
                  source={IMAGES[avatarNb - 1]}
                />
              ) : (
                <Image
                  style={styles.profile_comment}
                  source={IMAGES[avatarNb - 1]}
                />
              )}
              <Text style={{ marginTop: 14, fontFamily: "Futura" }}>
                {moment(this.props.data.postData.createdAt).fromNow() ===
                "il y a quelques secondes"
                  ? "il y a 1s"
                  : moment(this.props.data.postData.createdAt).fromNow().replace("minute", "mn")}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() =>
                  this.setState({
                    showTextInput: true,
                    showCommentComments: true
                  })
                }
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginTop: 3, fontSize: 18 }}>
                    {" "}
                    {this.props.data.postData.nbCommentComments}{" "}
                  </Text>
                  <Image
                    style={{
                      height: 24,
                      width: 24,
                      marginRight: 5,
                      tintColor: this.props.tintColor
                    }}
                    source={require("../assets/icons/comment.png")}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 5, marginBottom: 5 }}
                onPress={() => this.eraseData()}
              >
                <Image
                  style={{
                    height: 18,
                    width: 18,
                    marginRight: 5,
                    marginTop: 10,
                    marginBottom: 10,
                    tintColor: this.props.tintColor
                  }}
                  source={require("../assets/icons/supress.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              {this.state.liked ? this.liked() : this.unLiked()}
              <Text
                style={{
                  fontSize: 18,
                  marginTop: 12,
                  marginLeft: 7,
                  marginRight: 7
                }}
              >
                {this.props.data.postData.nbLikes}
              </Text>
              {this.state.disliked ? this.disliked() : this.unDisliked()}
            </View>
          </View>
          {this.state.contact ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    marginTop: 7,
                    fontSize: 16,
                    marginLeft: 17,
                    width: "80%"
                  }}
                >
                  {this.props.data.postData.text}
                </Text>

                {this.props.data.postData.imagePath ? (
                  <View style={{ borderRadius: 30, overflow: "hidden" }}>
                    <Lightbox
                      activeProps={{
                        style: styles.imageActive
                      }}
                    >
                      <Image
                        source={{ uri: this.props.data.postData.imagePath }}
                        resizeMode="contain"
                        style={{
                          height: 200,
                          width: 200,
                          marginLeft: 60,
                          overflow: "hidden"
                        }}
                      />
                    </Lightbox>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.createConversation(
                    this.props.data.id,
                    this.props.data.postData.userId,
                    this.props.data.postData.avatar,
                    this.props.userId,
                    this.props.data.postData.postKey
                  )
                }
              >
                <Image
                  style={{
                    marginBottom: 20,
                    height: 25,
                    width: 25,
                    marginRight: 20,
                    tintColor: this.props.tintColor
                  }}
                  source={require("../assets/icons/find.png")}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {!this.state.contact ? (
            <View>
              <Text
                style={{
                  marginTop: 7,
                  fontSize: 16,
                  marginLeft: 17,
                  width: "80%"
                }}
              >
                {this.props.data.postData.text}
              </Text>
              {this.props.data.postData.imagePath ? (
                <View style={{ borderRadius: 30, overflow: "hidden" }}>
                  <Lightbox
                    activeProps={{
                      style: styles.imageActive
                    }}
                  >
                    <Image
                      source={{ uri: this.props.data.postData.imagePath }}
                      resizeMode="contain"
                      style={{
                        height: 200,
                        width: 200,
                        marginLeft: 60,
                        overflow: "hidden"
                      }}
                    />
                  </Lightbox>
                </View>
              ) : null}
            </View>
          ) : null}
          {this.renderCommentsComments()}
          {this.writeCommentComment()}
        </KeyboardAwareScrollView>
        <Confirm
          visible={this.state.showModal}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
        >
          {this.state.confirm}
        </Confirm>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  me: {
    borderWidth: 1,
    borderColor: "red"
  },
  likesReact: {
    textDecorationLine: "underline",
    fontWeight: "bold"
  },
  send: {
    height: 18,
    width: 18,
    marginLeft: 14,
    marginTop: 4
  },
  textInput: {
    marginLeft: 50,
    fontSize: 15,
    borderWidth: 0.5,
    borderRadius: 20,
    height: 38,
    width: 70 + "%",
    padding: 10
  },

  profile_comment: {
    height: 30,
    width: 30,
    marginLeft: 12,
    marginRight: 15,
    marginTop: 3,
    borderRadius: 15
  },
  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 2
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    postKey: state.comments.post,
    group: state.auth.group,
    userId: state.auth.userId,
    oneSignalId: state.auth.oneSignalMyId,
    contact: state.contact.contact
  };
}

export default connect(
  mapStateToProps,
  actions
)(CommentCardView);
