import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Picker,
  Alert,
  Dimensions
} from "react-native";
import _ from "lodash";
import { firebaseApp } from "../firebase";
import ImagePicker from "react-native-image-picker";
import "moment/locale/fr";
import moment from "moment" ;
import CommentCard from "./CommentCard";
import { connect } from "react-redux";
import * as actions from "../actions";
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

const screenWidth = Dimensions.get("window").width;

class Card extends Component {
  state = {
    liked: false,
    disliked: false,
    contact: false,
    imagePath: null,
    imageHeight: null,
    imageWidth: null,
    color: "",
    tintColor: "",
    showModal: false,
    confirm: ""
  };

  async componentWillMount() {

    this.testLike();
    this.testDislike();
    this.testContact();
    switch (this.props.data.postData.color) {
      case "yellow":
        return this.setState({
          color: "rgb(255, 251, 194)",
          tintColor: "rgb(255, 219, 107)"
        });
      case "blue":
        return this.setState({
          color: "rgba(61, 191, 255, 0.23)",
          tintColor: "rgb(61, 191, 255)"
        });
      case "green":
        return this.setState({
          color: "rgba(76, 228, 155, 0.28)",
          tintColor: "rgb(76, 228, 155)"
        });
      case "red":
        return this.setState({
          color: "rgba(255, 109, 109, 0.23)",
          tintColor: "rgb(255, 109, 109)"
        });
      default:
        this.setState({ color: "" });
    }
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

  createConversation = async (idPost, userIdPost, userIdContact) => {
    const updates = {};
    const isPresent = this.props.contact.some(element => {
      return element.postKey === idPost + userIdPost;
    });
    if (isPresent) {
      return Alert.alert(
        "Attention",
        "Vous avez déjà contacté cette personne pour ce post !"
      );
    }
    //on fetch si l'user a deja commenté ou si on doit créer un nouvel avatar
    let avatarContact = "";
    await _.toArray(this.props.data.postData.users).forEach(element => {
      if (element.userId === userIdContact) {
        avatarContact = element.avatar;
      }
    });
    if (avatarContact === "") {
      avatarContact = `avatar${this.props.data.postData.nbUsers + 1}`;
      updates[
        `/posts/${this.props.group}/${
          this.props.data.postData.postKey
        }/users/${userIdContact}`
      ] = { avatar: avatarContact, userId: userIdContact };
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${this.props.data.postData.postKey}`)
        .transaction(p => {
          if (p) {
            p.nbUsers++;
          }
          return p;
        });
    }

    const newConvKey = firebaseApp.firebase_
      .database()
      .ref("user_conversations")
      .push().key;

    const messageKey = await firebaseApp.firebase_
      .database()
      .ref(`messages/${newConvKey}`)
      .push().key;
    let content = {};
    if (this.props.data.postData.image) {
      if (this.props.data.postData.text) {
        updates[`messages/${newConvKey}/${messageKey}`] = {
          image: this.props.data.postData.image,
          text: this.props.data.postData.text,
          user: {
            _id: this.props.data.postData.userId
          },
          firstMessage: true,
          nbLikes: this.props.data.postData.nbLikes,
          nbComments: this.props.data.postData.nbComments,
          createdAt: this.props.data.postData.createdAt,
          chatKey: newConvKey,
          messageKey,
          avatar: this.props.data.postData.avatar,
          name: "Anonyme"
        };
        content = {
          visible: "non_visible_" + new Date().getTime(),
          chatKey: newConvKey,
          createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          lastMessageDate: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          lastMessageText: "",
          postText: this.props.data.postData.text,
          postImage: this.props.data.postData.image,
          newMessages: 0,
          users: {
            user1: userIdPost,
            user2: userIdContact
          },
          postKey: this.props.data.postData.postKey,
          avatar: {
            [userIdPost]: {
              avatar: this.props.data.postData.avatar,
              userId: userIdPost
            },
            [userIdContact]: {
              //if comment created => fetch avatar else create avatar
              avatar: avatarContact,
              userId: userIdContact
            }
          },
          name: {
            [userIdPost]: {
              firstName: "Anonyme",
              lastName: "",
              userId: userIdPost
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
          image: this.props.data.postData.image,
          user: {
            _id: this.props.data.postData.userId
          },
          firstMessage: true,
          nbLikes: this.props.data.postData.nbLikes,
          nbComments: this.props.data.postData.nbComments,
          createdAt: this.props.data.postData.createdAt,
          chatKey: newConvKey,
          messageKey,
          avatar: this.props.data.postData.avatar,
          name: "Anonyme"
        };
        content = {
          visible: "non_visible_" + new Date().getTime(),
          chatKey: newConvKey,
          createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          lastMessageDate: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          lastMessageText: "",
          postImage: this.props.data.postData.image,
          postText: "Photo",
          newMessages: 0,
          users: {
            user1: userIdPost,
            user2: userIdContact
          },
          postKey: this.props.data.postData.postKey,
          avatar: {
            [userIdPost]: {
              avatar: this.props.data.postData.avatar,
              userId: userIdPost
            },
            [userIdContact]: {
              //if comment created => fetch avatar else create avatar
              avatar: avatarContact,
              userId: userIdContact
            }
          },
          name: {
            [userIdPost]: {
              firstName: "Anonyme",
              lastName: "",
              userId: userIdPost
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
        text: this.props.data.postData.text,
        user: {
          _id: this.props.data.postData.userId
        },
        firstMessage: true,
        nbLikes: this.props.data.postData.nbLikes,
        nbComments: this.props.data.postData.nbComments,
        createdAt: this.props.data.postData.createdAt,
        chatKey: newConvKey,
        messageKey,
        avatar: this.props.data.postData.avatar,
        name: "Anonyme"
      };

      content = {
        visible: "non_visible_" + new Date().getTime(),
        chatKey: newConvKey,
        createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
        lastMessageDate: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
        lastMessageText: "",
        postText: this.props.data.postData.text,
        newMessages: 0,
        users: {
          user1: userIdPost,
          user2: userIdContact
        },
        postKey: this.props.data.postData.postKey,
        avatar: {
          [userIdPost]: {
            avatar: this.props.data.postData.avatar,
            userId: userIdPost
          },
          [userIdContact]: {
            //if comment created => fetch avatar else create avatar
            avatar: avatarContact,
            userId: userIdContact
          }
        },
        name: {
          [userIdPost]: {
            firstName: "Anonyme",
            lastName: "",
            userId: userIdPost
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
    updates[`/user_conversations/${userIdPost}/${newConvKey}`] = content;
    updates[`/user_conversations/${userIdContact}/${newConvKey}`] = content;
    await firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);

    this.props.goToChat(newConvKey);
    this.props.navMessages();
  };

  renderAvatar() {
    const avatarNb = this.props.data.postData.avatar
      ? this.props.data.postData.avatar.slice(6)
      : null;
    return (
      <View style={styles.avatarContainer}>
        <View style={{ flexDirection: "row" }}>
          {this.props.data.postData.userId === this.props.userId ? (
            <Image
              style={[styles.profile, styles.me]}
              source={IMAGES[avatarNb - 1]}
            />
          ) : (
            <Image style={styles.profile} source={IMAGES[avatarNb - 1]} />
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {moment(this.props.data.postData.createdAt).fromNow()}
            </Text>
          </View>
        </View>
        <View>
          {this.state.contact ? (
            <TouchableOpacity
              onPress={() => {
                this.createConversation(
                  this.props.data.id,
                  this.props.data.postData.userId,
                  this.props.userId
                );
              }}
            >
              <Image
                style={{
                  marginBottom: 20,
                  height: 27,
                  width: 27,
                  marginRight: 5,
                  tintColor: this.state.tintColor
                }}
                source={require("../assets/icons/find.png")}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  renderContent() {
    const height =
      (screenWidth * this.props.data.postData.imageHeight) /
      (this.props.data.postData.imageWidth + 150);
    return (
      <View style={styles.content}>
        <Text
          style={{
            marginBottom: 10,
            fontSize: 14,
            marginLeft: 5,
            fontFamily: "Futura",
            fontWeight: "bold"
          }}
        >
          {this.props.data.postData.text}
        </Text>
        {this.props.data.postData.image ? (
          <Image
            source={{ uri: this.props.data.postData.image }}
            resizeMode="contain"
            style={{
              height: height,
              width: screenWidth,
              alignSelf: "center"
            }}
          />
        ) : null}
      </View>
    );
  }

  likePost = () => {
    this.setState({ liked: true });
    this.props.likePost(
      this.props.group,
      this.props.data.postData.postKey,
      this.props.data.postData.oneSignalIdCreator,
      this.props.oneSignalId,
      this.props.userId
    );
  };

  dislikePost = () => {
    this.setState({ disliked: true });
    this.props.dislikePost(
      this.props.group,
      this.props.data.postData.postKey,
      this.props.data.postData.oneSignalIdCreator,
      this.props.oneSignalId,
      this.props.userId
    );
  };

  liked = () => {
    return (
      <Image
        style={{
          height: 30,
          width: 30,
          marginTop: 12,
          marginRight: 10,
          marginBottom: 5,
          tintColor: this.state.tintColor
        }}
        source={require("../assets/icons/like.png")}
      />
    );
  };

  unLiked = () => {
    return this.state.disliked ? (
      <Image
        style={{
          height: 30,
          width: 30,
          marginTop: 12,
          marginRight: 10,
          marginBottom: 5,
          tintColor: this.state.tintColor
        }}
        source={require("../assets/icons/like.png")}
      />
    ) : (
      <TouchableOpacity onPress={() => this.likePost()}>
        <Image
          style={{
            height: 30,
            width: 30,
            marginTop: 12,
            marginRight: 10,
            marginBottom: 5,
            tintColor: this.state.tintColor
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
          height: 30,
          width: 30,
          marginTop: 12,
          marginRight: 10,
          marginBottom: 5,
          tintColor: this.state.tintColor
        }}
        source={require("../assets/icons/dislike.png")}
      />
    );
  };

  unDisliked = () => {
    return this.state.liked ? (
      <Image
        style={{
          height: 30,
          width: 30,
          marginTop: 12,
          marginRight: 10,
          marginBottom: 5,
          tintColor: this.state.tintColor
        }}
        source={require("../assets/icons/dislike.png")}
      />
    ) : (
      <TouchableOpacity onPress={() => this.dislikePost()}>
        <Image
          style={{
            height: 30,
            width: 30,
            marginTop: 12,
            marginRight: 10,
            marginBottom: 5,
            tintColor: this.state.tintColor
          }}
          source={require("../assets/icons/dislike.png")}
        />
      </TouchableOpacity>
    );
  };

  eraseData = async () => {
    if (this.state.contact === false) {
      await this.setState({ confirm: "Voulez vous supprimer votre post?" });
    } else {
      await this.setState({ confirm: "Voulez vous signaler ce post?" });
    }
    this.setState({ showModal: true });
  };

  renderLikes() {
    return (
      <View style={styles.row}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 30,
              width: 30,
              marginRight: 5,
              marginTop: 12,
              marginBottom: 10,
              tintColor: this.state.tintColor
            }}
            source={require("../assets/icons/comment.png")}
          />
          <Text style={{ fontSize: 13, marginTop: 19, fontFamily: "Futura" }}>
            {this.props.data.postData.nbComments} coms
          </Text>
        </View>
        <TouchableOpacity onPress={() => this.eraseData()}>
          <Image
            style={{
              height: 18,
              width: 18,
              marginRight: 5,
              marginTop: 19,
              marginBottom: 10,
              tintColor: this.state.tintColor
            }}
            source={require("../assets/icons/supress.png")}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginRight: 5 }}>
          {this.state.liked ? this.liked() : this.unLiked()}
          <Text style={{ marginTop: 15, marginRight: 10, fontSize: 20 }}>
            {this.props.data.postData.nbLikes >= 0 ? "+" : null}
            {this.props.data.postData.nbLikes}
          </Text>
          {this.state.disliked ? this.disliked() : this.unDisliked()}
        </View>
      </View>
    );
  }

  onDecline = () => {
    this.setState({ showModal: false });
  };

  onAccept = async () => {
    if (this.state.confirm === "Voulez vous supprimer votre post?") {
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${this.props.data.postData.postKey}`)
        .remove();
      this.setState({ showModal: false });
    } else {
      if (this.props.data.postData.text) {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.data.postData.postKey}`)
          .set({
            signalement: this.props.data.postData.postKey,
            text: this.props.data.postData.text,
            type: "post"
          });
      } else {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.data.postData.postKey}`)
          .set({
            signalement: this.props.data.postData.postKey,
            text: "image",
            type: "post"
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

  render() {
    const textInputValue =
      this.props.data.postData.postKey === this.props.postKey
        ? this.props.text
        : "";
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.nav(this.props.data.postData.postKey)}
        >
          <View
            style={[styles.container, { backgroundColor: this.state.color }]}
          >
            {this.renderAvatar()}
            {this.renderContent()}
            {this.renderLikes()}
          </View>
        </TouchableOpacity>
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
  textPhoto: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 20
  },
  textPhoto2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 20
  },
  me: {
    borderWidth: 1,
    borderColor: "red",
    marginTop: 0
  },
  send: {
    height: 25,
    width: 25,
    marginLeft: 20,
    marginTop: 10
  },
  textInput: {
    fontSize: 16,
    height: 45,
    width: 85 + "%",
    padding: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginTop: 13
  },
  likes: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 32,
    paddingTop: 7,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3
  },
  container: {
    display: "flex",
    marginBottom: 2,
    marginLeft: 2,
    marginRight: 2
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0
  },
  line: {
    margin: 16,
    marginBottom: 0,
    borderColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  avatarContainer: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: "row",
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between"
  },
  nameContainer: {
    marginLeft: 10,
    justifyContent: "space-around"
  },
  name: {
    fontSize: 14,
    fontFamily: "Futura",
    color: "black",
    fontWeight: "600"
  },
  time: {
    color: "gray",
    fontSize: 12
  },
  profile: {
    height: 20,
    width: 20,
    borderRadius: 5,
    marginTop: 10
  },
  buttonContainer: {
    flexDirection: "row",
    height: 36,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  buttonItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    color: "gray"
  },
  likeText: {
    fontSize: 12,
    color: "gray"
  },
  footer: {
    width: 240
  },
  list_photo: {
    height: 20,
    width: 20
  }
});

function mapStateToProps(state) {
  return {
    text: state.createComment.text,
    postKey: state.createComment.postKey,
    group: state.auth.group,
    contact: state.contact.contact,
    userId: state.auth.userId,
    oneSignalId: state.auth.oneSignalMyId
  };
}

export default connect(
  mapStateToProps,
  actions
)(Card);
