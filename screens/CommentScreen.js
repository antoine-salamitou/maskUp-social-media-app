import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
  findNodeHandle,
  Dimensions,
  Linking
} from "react-native";
import { NavigationActions } from "react-navigation";
import { firebaseApp } from "../firebase";
import ImagePicker from "react-native-image-picker";
import { Button } from "react-native-elements";
import Lightbox from "react-native-lightbox";
import _ from "lodash";
import "moment/locale/fr";
import moment from "moment" ;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommentCardView from "../components/CommentCardView";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Spinner } from "../components/Spinner";
import { Confirm } from "../components/Confirm";

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

class CommentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitleStyle: {
        color: "black"
      },
      headerStyle: {
        backgroundColor: "white"
      },
      headerRight: (
        <Button
          onPress={() => params.handleThis()}
          title="Contactez nous"
          color="black"
          backgroundColor="white"
        />
      )
    };
  };

  state = {
    counter: 7,
    thisArguments: [],
    post: {},
    isEmpty: false,
    isLoading: false,
    isFinished: false,
    liked: false,
    disliked: false,
    contact: false,
    postKey: "",
    imagePath: null,
    imageHeight: null,
    imageWidth: null,
    color: "",
    tintColor: "",
    confirm: "",
    showModal: false
  };

  componentDidMount() {
    this.fetchData();
    this.props.navigation.setParams({
      handleThis: this.sendEmail
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postKey !== this.state.postKey) {
      this.setState({
        postKey: nextProps.postKey,
        counter: 7,
        liked: false,
        disliked: false,
        contact: false,
        isEmpty: false,
        isLoading: false,
        isFinished: false,
        color: ""
      });
      firebaseApp.firebase_
        .database()
        .ref(`/posts_comments/${this.props.postKey}`)
        .off();
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${this.props.postKey}`)
        .off();
      const fb = firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${nextProps.postKey}`);
      fb.on("value", async snapshot => {
        if (!snapshot.val()) {
          await this.setState({ post: {} });
          const backAction = NavigationActions.back({
            key: null
          });
          await this.props.navigation.dispatch(backAction);
          setTimeout(() => {
            Alert.alert("Ce post a été supprimé.");
          }, 300);
        } else {
          await this.setState({ post: snapshot.val() });
          const isPresent = _.toArray(snapshot.val().likes).some(element => {
            return element.userId === this.props.userId;
          });
          if (isPresent) {
            await this.setState({ liked: true });
          }
          const isPresent2 = _.toArray(snapshot.val().likes).some(element => {
            return element.userId === this.props.userId;
          });
          if (isPresent2) {
            await this.setState({ disliked: true });
          }

          if (snapshot.val().userId !== this.props.userId) {
            this.setState({ contact: true });
          }
          this.setColor(snapshot.val().color);
        }
      });
      this.data = [];
      this.setState({ thisArguments: this.data });
      this.commentChildAdded(nextProps.postKey);
      this.commentChildRemovedOrUpdated(nextProps.postKey);
    }
  }

  componentWillUnmount() {
    firebaseApp.firebase_
      .database()
      .ref(`/posts_comments/${this.props.postKey}`)
      .off();
    firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.group}/${this.props.postKey}`)
      .off();
  }

  fetchData = async () => {
    this.data = [];
    const fb = firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.group}/${this.props.postKey}`);
    fb.on("value", async snapshot => {
      if (!snapshot.val()) {
        await this.setState({ post: {} });
        const backAction = NavigationActions.back({
          key: null
        });
        await this.props.navigation.dispatch(backAction);
        setTimeout(() => {
          Alert.alert("Ce post a été supprimé.");
        }, 300);
      } else {
        await this.setState({ post: snapshot.val() });
        const isPresent = _.toArray(snapshot.val().likes).some(element => {
          return element.userId === this.props.userId;
        });
        if (isPresent) {
          await this.setState({ liked: true });
        }
        const isPresent2 = _.toArray(snapshot.val().dislikes).some(element => {
          return element.userId === this.props.userId;
        });
        if (isPresent2) {
          await this.setState({ disliked: true });
        }

        if (snapshot.val().userId !== this.props.userId) {
          this.setState({ contact: true });
        }
        this.setColor(this.state.post.color);
      }
    });

    this.setState({ postKey: this.props.postKey });
    this.commentChildAdded(this.props.postKey);
    this.commentChildRemovedOrUpdated(this.props.postKey);
  };

  onEndReached = async () => {
    if (
      !this.state.isEmpty &&
      !this.state.isFinished &&
      !this.state.isLoading
    ) {
      await this.setState({ counter: this.state.counter + 3 });
      await this.setState({ isLoading: true });
      firebaseApp.firebase_
        .database()
        .ref(`/posts_comments/${this.props.postKey}`)
        .off();
      this.data = [];
      this.commentChildAdded(this.props.postKey);
      this.commentChildRemovedOrUpdated(this.props.postKey);
    }
  };

  setColor = color => {
    switch (color) {
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
  };

  eraseData = async () => {
    if (this.state.contact === false) {
      await this.setState({ confirm: "Voulez vous supprimer votre post?" });
    } else {
      await this.setState({ confirm: "Voulez vous signaler ce post?" });
    }
    this.setState({ showModal: true });
  };

  commentChildRemovedOrUpdated = async postKey => {
    await firebaseApp.firebase_
      .database()
      .ref(`/posts_comments/${postKey}`)
      .orderByChild("createdAt")
      .limitToLast(this.state.counter)
      .on("child_changed", async snapshot => {
        if (snapshot.val().nbLikes <= -3) {
          this.data = this.data.filter(x => x.id !== snapshot.key);
        } else {
          this.data.forEach((element, index) => {
            if (element.id === snapshot.key) {
              this.data[index] = { id: snapshot.key, postData: snapshot.val() };
            }
          });
        }
        await this.setState({
          thisArguments: this.data
        });
      });

    await firebaseApp.firebase_
      .database()
      .ref(`/posts_comments/${postKey}`)
      .orderByChild("createdAt")
      .limitToLast(this.state.counter)
      .on("child_removed", async snapshot => {
        this.data = this.data.filter(x => x.id !== snapshot.key);
        await this.setState({
          thisArguments: this.data
        });
      });
  };

  commentChildAdded = async postKey => {
    let i = 0;
    let lastPushDate = 0;
    await firebaseApp.firebase_
      .database()
      .ref(`/posts_comments/${postKey}`)
      .orderByChild("createdAt")
      .limitToLast(this.state.counter)
      .on("child_added", async snapshot => {
        i += 1;
        if (
          snapshot.val().createdAt > lastPushDate &&
          snapshot.val().nbLikes > -3
        ) {
          await this.data.unshift({
            id: snapshot.key,
            postData: snapshot.val()
          });
          lastPushDate = snapshot.val().createdAt;
          await this.setState({
            thisArguments: this.data
          });
        }
        await this.setState({ isLoading: false });
        if (i < this.state.counter) {
          this.setState({ isFinished: true });
        }
      });
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

    let avatarContact = "";

    await _.toArray(this.state.post.users).forEach(element => {
      if (element.userId === userIdContact) {
        avatarContact = element.avatar;
      }
    });

    if (avatarContact === "") {
      avatarContact = `avatar${this.state.post.nbUsers + 1}`;
      updates[
        `/posts/${this.props.group}/${
          this.state.post.postKey
        }/users/${userIdContact}`
      ] = { avatar: avatarContact, userId: userIdContact };

      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}/${this.state.post.postKey}`)
        .transaction(p => {
          if (p) {
            p.nbUsers++;
          }
          return p;
        });
    }

    firebaseApp.firebase_
      .database()
      .ref(`posts/${this.props.group}/${idPost}`)
      .once("value", async snapshot => {
        const newConvKey = firebaseApp.firebase_
          .database()
          .ref("user_conversations")
          .push().key;
        let content = {};

        const messageKey = await firebaseApp.firebase_
          .database()
          .ref(`messages/${newConvKey}`)
          .push().key;
        if (this.state.post.image) {
          if (this.state.post.text) {
            updates[`messages/${newConvKey}/${messageKey}`] = {
              text: this.state.post.text,
              image: this.state.post.image,
              user: {
                _id: this.state.post.userId
              },
              nbLikes: this.state.post.nbLikes,
              nbComments: this.state.post.nbComments,
              firstMessage: true,
              createdAt: this.state.post.createdAt,
              newConvKey,
              messageKey,
              avatar: this.state.post.avatar,
              name: "Anonyme"
            };
            content = {
              visible: "non_visible_" + new Date().getTime(),
              chatKey: newConvKey,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageDate:
                firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageText: "",
              postText: this.state.post.text,
              postImage: this.state.post.image,
              newMessages: 0,
              users: {
                user1: userIdPost,
                user2: userIdContact
              },
              avatar: {
                [userIdPost]: {
                  avatar: this.state.post.avatar,
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
              },
              postKey: this.state.post.postKey
            };
          } else {
            updates[`messages/${newConvKey}/${messageKey}`] = {
              image: this.state.post.image,
              user: {
                _id: this.state.post.userId
              },
              nbLikes: this.state.post.nbLikes,
              nbComments: this.state.post.nbComments,
              firstMessage: true,
              createdAt: this.state.post.createdAt,
              newConvKey,
              messageKey,
              avatar: this.state.post.avatar,
              name: "Anonyme"
            };
            content = {
              visible: "non_visible_" + new Date().getTime(),
              chatKey: newConvKey,
              createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageDate:
                firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
              lastMessageText: "",
              postImage: this.state.post.image,
              postText: "Photo",
              newMessages: 0,
              users: {
                user1: userIdPost,
                user2: userIdContact
              },
              avatar: {
                [userIdPost]: {
                  avatar: this.state.post.avatar,
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
              },
              postKey: this.state.post.postKey
            };
          }
        } else {
          updates[`messages/${newConvKey}/${messageKey}`] = {
            text: this.state.post.text,
            user: {
              _id: this.state.post.userId
            },
            nbLikes: this.state.post.nbLikes,
            nbComments: this.state.post.nbComments,
            firstMessage: true,
            createdAt: this.state.post.createdAt,
            newConvKey,
            messageKey,
            avatar: this.state.post.avatar,
            name: "Anonyme"
          };

          content = {
            visible: "non_visible_" + new Date().getTime(),
            chatKey: newConvKey,
            createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            lastMessageDate:
              firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
            lastMessageText: "",
            postText: this.state.post.text,
            newMessages: 0,
            users: {
              user1: userIdPost,
              user2: userIdContact
            },
            avatar: {
              [userIdPost]: {
                avatar: this.state.post.avatar,
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
            },
            postKey: this.state.post.postKey
          };
        }
        updates[`/user_conversations/${userIdPost}/${newConvKey}`] = content;
        updates[
          `/user_conversations/${userIdContact}/${newConvKey}`
        ] = content;

        firebaseApp.firebase_
          .database()
          .ref()
          .update(updates);
        this.props.goToChat(newConvKey);
        this.props.navigation.navigate("messages");
      });

    //this.setState({ contact: false });
  };

  renderAvatar() {
    const avatarNb = this.state.post.avatar
      ? this.state.post.avatar.slice(6)
      : null;
    return (
      <View style={styles.avatarContainer}>
        <View style={{ flexDirection: "row" }}>
          {this.state.post.userId === this.props.userId ? (
            <Image
              style={[styles.profile, styles.me]}
              source={IMAGES[avatarNb - 1]}
            />
          ) : (
            <Image style={styles.profile} source={IMAGES[avatarNb - 1]} />
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {moment(this.state.post.createdAt).fromNow()}
            </Text>
          </View>
        </View>
        <View>
          {this.state.contact ? (
            <TouchableOpacity
              onPress={() => {
                this.createConversation(
                  this.state.post.postKey,
                  this.state.post.userId,
                  this.props.userId
                );
              }}
            >
              <Image
                style={{
                  marginBottom: 20,
                  height: 30,
                  width: 30,
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

  sendEmail = () => {
    Linking.openURL(
      "mailto:contactezmask@gmail.com?subject=Suggestion&body=N'hésite pas à nous envoyer tes problèmes ou suggestions pour Mask !"
    );
  };

  renderContent() {
    const height =
      (screenWidth * this.state.post.imageHeight) / this.state.post.imageWidth;
    return (
      <View style={styles.content}>
        <Text
          style={{
            marginBottom: 10,
            fontSize: 20,
            fontFamily: "Futura",
            fontWeight: "bold"
          }}
        >
          {this.state.post.text}
        </Text>
        {this.state.post.image ? (
          <Lightbox
            activeProps={{
              style: styles.imageActive
            }}
          >
            <Image
              source={{ uri: this.state.post.image }}
              resizeMode="contain"
              style={{
                height: height,
                width: screenWidth,
                alignSelf: "center"
              }}
            />
          </Lightbox>
        ) : null}
      </View>
    );
  }

  likePost = () => {
    this.setState({ liked: true });
    this.props.likePost(
      this.props.group,
      this.state.post.postKey,
      this.state.post.oneSignalIdCreator,
      this.props.oneSignalId,
      this.props.userId
    );
  };

  dislikePost = () => {
    this.setState({ disliked: true });
    this.props.dislikePost(
      this.props.group,
      this.state.post.postKey,
      this.state.post.oneSignalIdCreator,
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
          marginTop: 10,
          marginRight: 10,
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
          marginTop: 10,
          marginRight: 10,
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
            marginTop: 10,
            marginRight: 10,
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
          marginTop: 10,
          marginRight: 10,
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
          marginTop: 10,
          marginRight: 10,
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
            marginTop: 10,
            marginRight: 10,
            tintColor: this.state.tintColor
          }}
          source={require("../assets/icons/dislike.png")}
        />
      </TouchableOpacity>
    );
  };

  renderLikes() {
    return (
      <View style={styles.rowLikes}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 30,
              width: 30,
              marginRight: 5,
              marginTop: 10,
              tintColor: this.state.tintColor
            }}
            source={require("../assets/icons/comment.png")}
          />
          <Text style={{ fontSize: 13, marginTop: 16, fontFamily: "Futura" }}>
            {this.state.post.nbComments} coms
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
          <Text style={{ marginTop: 13, marginRight: 10, fontSize: 20 }}>
            {this.state.post.nbLikes}
          </Text>
          {this.state.disliked ? this.disliked() : this.unDisliked()}
        </View>
      </View>
    );
  }

  navigateToMessages = () => {
    this.props.navigation.navigate("messages");
  };

  renderItem = ({ item }) => {
    return (
      <CommentCardView
        data={item}
        tintColor={this.state.tintColor}
        navMessages={this.navigateToMessages}
      />
    );
  };

  renderComment() {
    const posts = _.toArray(this.state.thisArguments);
    return (
      <View>
        {posts.length < this.state.counter ? null : (
          <TouchableOpacity onPress={this.onEndReached}>
            <Text style={styles.commentairesPrecedents}>
              Voir les commentaires précédents
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <FlatList
            inverted
            data={posts}
            extraData={this.state}
            keyExtractor={item => item.postData.commentKey}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
          />
        </View>
      </View>
    );
  }

  renderFooter = () => {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return null;
  };

  writeComment(valueTextInput) {
    return this.state.imagePath ? (
      <View
        style={{
          padding: 16,
          marginBottom: 5,
          flexDirection: "row"
        }}
      >
        <View style={styles.textPhoto2}>
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: this.state.imagePath }}
              resizeMode="contain"
              style={{
                height: 100,
                width: 100,
                marginLeft: 20,
                marginBottom: 10,
                marginTop: 5
              }}
            />
          </View>

          <TextInput
            multiline
            style={[styles.textInput, { color: this.state.color }]}
            keyboardShouldPersistTaps="handled"
            placeholderTextColor={"gray"}
            placeholder={"React anonymously"}
            value={valueTextInput}
            onChangeText={text =>
              this.props.createCommentText(text, this.props.postKey)
            }
            onFocus={(event: Event) => {
              this.scrollToInput(findNodeHandle(event.target));
            }}
          />
        </View>
        <TouchableOpacity onPress={() => this.sendComment(valueTextInput)}>
          <Image
            style={[styles.send, { marginTop: 60 }]}
            source={require("../assets/icons/send.png")}
          />
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={{
          padding: 16,
          marginBottom: 5,
          flexDirection: "row"
        }}
      >
        <View style={styles.textPhoto}>
          <TextInput
            multiline
            style={styles.textInput}
            keyboardShouldPersistTaps="handled"
            placeholderTextColor={"gray"}
            placeholder={"React anonymously"}
            value={valueTextInput}
            onChangeText={text =>
              this.props.createCommentText(text, this.props.postKey)
            }
            onFocus={(event: Event) => {
              this.scrollToInput(findNodeHandle(event.target));
            }}
          />
          <TouchableOpacity onPress={() => this.photo()}>
            <Image
              style={styles.list_photo}
              source={require("../assets/icons/picture.png")}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.sendComment(valueTextInput)}>
          <Image
            style={styles.send}
            source={require("../assets/icons/send.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }

  scrollToInput(reactNode: any) {
    this.scroll.props.scrollToFocusedInput(reactNode);
  }

  sendComment = valueTextInput => {
    this.setState({ imagePath: "" });
    this.props.createComment(
      valueTextInput,
      this.props.group,
      this.props.postKey,
      this.state.post.nbUsers,
      this.state.post.oneSignalIds,
      this.props.userId,
      this.props.oneSignalId,
      this.state.imagePath,
      this.state.imageWidth,
      this.state.imageHeight
    );
    Keyboard.dismiss();
  };

  photo = () => {
    this.setState({ loading: true });

    const options = {
      title: "Select Image",
      quality: 0.05,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      this.setState({ loading: false });
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          imagePath: response.uri,
          imageHeight: response.height,
          imageWidth: response.width
        });
      }
    });
  };

  onAccept = async () => {
    if (this.state.confirm === "Voulez vous supprimer votre post?") {
      await this.setState({ showModal: false });

      const backAction = NavigationActions.back({
        key: null
      });
      await this.props.navigation.dispatch(backAction);
      setTimeout(() => {
        firebaseApp.firebase_
          .database()
          .ref(`/posts/${this.props.group}/${this.props.postKey}`)
          .remove();
      }, 1000);
    } else {
      if (this.props.text) {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.postKey}`)
          .set({
            signalement: this.props.postKey,
            text: this.props.text,
            type: "post"
          });
      } else {
        firebaseApp.firebase_
          .database()
          .ref(`/signalements/${this.props.postKey}`)
          .set({
            signalement: this.props.postKey,
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

  onDecline = () => {
    this.setState({ showModal: false });
  };

  render() {
    const valueTextInput =
      this.props.postKeyText === this.props.postKey ? this.props.text : "";
    return (
      <View style={[styles.container, { backgroundColor: this.state.color }]}>
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref;
          }}
        >
          <View
            style={{
              borderBottomWidth: 0.3,
              marginBottom: 20,
              paddingBottom: 10
            }}
          >
            {this.renderAvatar()}
            {this.renderContent()}
            {this.renderLikes()}
          </View>
          {this.renderComment()}
          {this.writeComment(valueTextInput)}
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
  commentairesPrecedents: {
    marginBottom: 10,
    fontStyle: "italic",
    marginLeft: 20 + "%"
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
    height: 46,
    marginRight: 15
  },
  rowLikes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    marginTop: 13
  },
  container: {
    display: "flex",
    backgroundColor: "white",
    marginLeft: 2,
    marginRight: 2,
    flex: 1
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
    color: "black",
    fontWeight: "600",
    fontFamily: "Futura"
  },

  time: {
    color: "gray",
    fontSize: 12
  },

  profile: {
    height: 25,
    width: 25,
    borderRadius: 10,
    marginTop: 7
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
  textPhoto2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 0.5,
    borderRadius: 20
  },
  list_photo: {
    height: 20,
    width: 20
  },
  textPhoto: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 0.5,
    borderRadius: 20
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    text: state.createComment.text,
    postKeyText: state.createComment.postKey,
    group: state.auth.group,
    postKey: state.comments.post,
    contact: state.contact.contact,
    userId: state.auth.userId,
    oneSignalId: state.auth.oneSignalMyId
  };
}

export default connect(
  mapStateToProps,
  actions
)(CommentScreen);
