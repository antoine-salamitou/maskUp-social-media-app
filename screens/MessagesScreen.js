import React, { Component } from "react";
import {
  FlatList,
  Text,
  View,
  TextInput,
  Keyboard,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { firebaseApp } from "../firebase";
import Analytics from "appcenter-analytics";
import { Button } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import * as actions from "../actions";
import Message from "../components/Messages/Message";
import _ from "lodash";
import { Spinner } from "../components/Spinner";
import { Confirm } from "../components/Confirm";

const screenWidth = Dimensions.get("window").width;
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

class MessagesScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: params.firstName + " " + params.lastName,
      headerTitleStyle: {
        color: "black"
      },
      headerStyle: {
        backgroundColor: "white"
      },
      headerRight:
        params.unmask === "Anonyme" ? (
          <Button
            onPress={() => {
              params.handleThis();
            }}
            title="Unmask"
            color="black"
            backgroundColor="white"
          />
        ) : null
    };
  };

  state = {
    keyboardHeight: new Animated.Value(0),
    messages: [],
    isEmpty: false,
    isLoading: false,
    isFinished: true,
    counter: 30,
    chatKey: "",
    postKey: "",
    postColor: "",
    avatar: "",
    firstName: "",
    lastName: "",
    showModal: false,
    userIdOther: "",
    firstNameOther: "",
    lastNameOther: "",
    oneSignalIdOther: "",
    lastchatKey: ""
  };

  componentWillMount() {
    this.props.startChat();
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );

    this.setState({ chatKey: this.props.chatKey });

    if (this.props.nbMessages !== 0) {
      this.props.minusMessageNotification();
    }

    firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}/${this.props.chatKey}`)
      .update({ newMessages: 0 });
    firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}/${this.props.chatKey}`)
      .on("value", snapshot => {
        const userId = this.props.userId;
        this.setState({
          postKey: snapshot.val().postKey,
          postColor: snapshot.val().postColor,
          avatar: snapshot.val().avatar[userId].avatar,
          firstName: snapshot.val().name[userId].firstName,
          lastName: snapshot.val().name[userId].lastName
        });
        _.toArray(snapshot.val().name).forEach(element => {
          if (element.userId !== this.props.userId) {
            this.props.navigation.setParams({
              firstName: element.firstName,
              lastName: element.lastName
            });
            this.setState({
              userIdOther: element.userId,
              firstNameOther: element.firstName,
              lastNameOther: element.lastName
            });
            firebaseApp.firebase_
              .database()
              .ref(`one_signal_ids/${element.userId}`)
              .once("value", snapshot2 => {
                if (snapshot2.val()) {
                  this.setState({
                    oneSignalIdOther: snapshot2.val().oneSignalId
                  });
                }
              });
          } else {
            this.props.navigation.setParams({
              unmask: element.firstName
            });
          }
        });
      });

    firebaseApp.firebase_
      .database()
      .ref(`/messages/${this.props.chatKey}`)
      .limitToLast(this.state.counter)
      .on("value", async snapshot => {
        if (_.toArray(snapshot.val()).length === this.state.counter) {
          await this.setState({ isFinished: false });
        }
        console.log('coucou')
        console.log(!this.state.lastChatKey)
        if (
          (this.state.lastChatKey !== _.reverse(_.toArray(snapshot.val()))[0].messageKey &&
            _.reverse(_.toArray(snapshot.val()))[0].user._id !==
              this.props.userId && this.state.lastChatKey)
        ) {

          firebaseApp.firebase_
            .database()
            .ref(
              `user_conversations/${this.props.userId}/${this.props.chatKey}`
            )
            .transaction(p => {
              if (p) {
                p.newMessages--;
              }
              return p;
            });
        }
        this.setState({
          messages: _.reverse(_.toArray(snapshot.val())),
          lastChatKey: _.reverse(_.toArray(snapshot.val()))[0].messageKey
        });
      });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleThis: this.changeModalState
    });
  }

  changeModalState = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  componentWillUnmount() {
    this.props.endChat();
    this.props.convFinished();
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    firebaseApp.firebase_
      .database()
      .ref("messages")
      .child(this.props.chatKey)
      .off();
    firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}/${this.props.chatKey}`)
      .off();
  }

  componentWillReceiveProps(nextProps) {
    //si on apelle depuis mapscreen, on a la possibilité de changer le chat
    if (nextProps.chatKey !== this.state.chatKey) {
      firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}/${this.state.chatKey}`)
        .off();
      firebaseApp.firebase_
        .database()
        .ref(`/messages/${this.state.chatKey}`)
        .off();
      this.setState({ chatKey: nextProps.chatKey });
      firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}/${nextProps.chatKey}`)
        .on("value", snapshot => {
          const userId = this.props.userId;
          this.setState({
            postKey: snapshot.val().postKey,
            postColor: snapshot.val().postColor,
            avatar: snapshot.val().avatar[userId].avatar,
            firstName: snapshot.val().name[userId].firstName,
            lastName: snapshot.val().name[userId].lastName
          });
          _.toArray(snapshot.val().name).forEach(element => {
            if (element.userId !== this.props.userId) {
              this.props.navigation.setParams({
                firstName: element.firstName,
                lastName: element.lastName
              });
              this.setState({
                userIdOther: element.userId,
                firstNameOther: element.firstName,
                lastNameOther: element.lastName
              });
              firebaseApp.firebase_
                .database()
                .ref(`one_signal_ids/${element.userId}`)
                .once("value", snapshot2 => {
                  if (snapshot2.val()) {
                    this.setState({
                      oneSignalIdOther: snapshot2.val().oneSignalId
                    });
                  }
                });
            } else {
              this.props.navigation.setParams({
                unmask: element.firstName
              });
            }
          });
        });
      firebaseApp.firebase_
        .database()
        .ref(`/messages/${nextProps.chatKey}`)
        .limitToLast(this.state.counter)
        .on("value", async snapshot => {
          if (_.toArray(snapshot.val()).length === this.state.counter) {
            await this.setState({ isFinished: false });
          }
          if (
            (this.state.lastChatKey !== _.reverse(_.toArray(snapshot.val()))[0].chatKey &&
              _.reverse(_.toArray(snapshot.val()))[0].user._id !==
                this.props.userId) ||
            !this.state.lastChatKey
          ) {

            firebaseApp.firebase_
              .database()
              .ref(
                `user_conversations/${this.props.userId}/${this.props.chatKey}`
              )
              .transaction(p => {
                if (p) {
                  p.newMessages--;
                }
                return p;
              });
          }
          this.setState({
            messages: _.reverse(_.toArray(snapshot.val())),
            lastChatKey: _.reverse(_.toArray(snapshot.val()))[0].chatKey
          });
        });
      this.setState({ chatKey: nextProps.chatKey });
    }
  }

  onSend = async () => {
    let typePost = "";
      switch (this.state.postColor) {
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
    const updates = {};
    Analytics.trackEvent("send message", { Category: typePost });
    if (this.state.messages.length === 1) {
      //si c le premier message on crée la conversation chez l'autre user aussi

      updates[
        `contact/${this.props.userId}/${this.state.postKey}${
          this.state.userIdOther
        }/createdAt`
      ] =
        firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
      updates[
        `contact/${this.props.userId}/${this.state.postKey}${
          this.state.userIdOther
        }/postKey`
      ] =
        this.state.postKey + this.state.userIdOther;

      this.props.addContact(this.state.postKey + this.state.userIdOther);

      fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
          include_player_ids: [this.state.oneSignalIdOther],
          headings: {
            en:
              "Nouveau message de " +
              this.state.firstName +
              " " +
              this.state.lastName
          },
          contents: {
            en: "Quelqu un essaie de vous contacter suite à votre post ..."
          },
          data: { chatKey: this.props.chatKey }
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
    if (this.props.textMessage.length !== 0) {
      const textMessage = this.props.textMessage;
      this.props.messageFinished();

      const messageKey = await firebaseApp.firebase_
        .database()
        .ref(`messages/${this.props.chatKey}`)
        .push().key;
      updates[`messages/${this.props.chatKey}/${messageKey}`] = {
        text: textMessage,
        user: {
          _id: this.props.userId
        },
        firstMessage: false,
        createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
        chatKey: this.props.chatKey,
        messageKey,
        avatar: this.state.avatar,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      };

      updates[
        `user_conversations/${this.state.userIdOther}/${
          this.props.chatKey
        }/lastMessageText`
      ] = textMessage;
      updates[
        `user_conversations/${this.state.userIdOther}/${
          this.props.chatKey
        }/lastMessageDate`
      ] =
        firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
      updates[
        `user_conversations/${this.state.userIdOther}/${
          this.props.chatKey
        }/visible`
      ] =
        "visible_" + new Date().getTime();

      updates[
        `user_conversations/${this.props.userId}/${
          this.props.chatKey
        }/lastMessageText`
      ] = textMessage;
      updates[
        `user_conversations/${this.props.userId}/${
          this.props.chatKey
        }/lastMessageDate`
      ] =
        firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
      updates[
        `user_conversations/${this.props.userId}/${this.props.chatKey}/visible`
      ] =
        "visible_" + new Date().getTime();

      firebaseApp.firebase_
        .database()
        .ref()
        .update(updates);

      fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
          include_player_ids: [this.state.oneSignalIdOther],
          headings: {
            en:
              "Nouveau message de " +
              this.state.firstName +
              " " +
              this.state.lastName
          },
          contents: { en: textMessage },
          data: { chatKey: this.props.chatKey }
        })
      })
        .then(responseData => {
          //console.log('Push POST:' + JSON.stringify(responseData))
        })
        .catch(errorData => {
          console.log("Push ERROR:" + JSON.stringify(errorData));
        })
        .done();

      await firebaseApp.firebase_
        .database()
        .ref(
          `user_conversations/${this.state.userIdOther}/${this.props.chatKey}`
        )
        .transaction(p => {
          if (p) {
            p.newMessages++;
          }
          return p;
        });
    }
  };

  onEndReached = async () => {
    if (
      !this.state.isEmpty &&
      !this.state.isFinished &&
      !this.state.isLoading
    ) {
      await this.setState({ counter: this.state.counter + 20 });
      await this.setState({ isLoading: true });
      firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}/${this.props.chatKey}`)
        .off();
      firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}/${this.props.chatKey}`)
        .on("value", snapshot => {
          const userId = this.props.userId;
          this.setState({
            postKey: snapshot.val().postKey,
            postColor: snapshot.val().postColor,
            avatar: snapshot.val().avatar[userId].avatar,
            firstName: snapshot.val().name[userId].firstName,
            lastName: snapshot.val().name[userId].lastName
          });
        });
      firebaseApp.firebase_
        .database()
        .ref(`/messages/${this.props.chatKey}`)
        .off();
      firebaseApp.firebase_
        .database()
        .ref(`/messages/${this.props.chatKey}`)
        .limitToLast(this.state.counter)
        .on("value", async snapshot => {
          if (_.toArray(snapshot.val()).length < this.state.counter) {
            await this.setState({ isFinished: true });
          }

          if (
            (this.state.lastChatKey !== _.reverse(_.toArray(snapshot.val()))[0].chatKey &&
              _.reverse(_.toArray(snapshot.val()))[0].user._id !==
                this.props.userId) ||
            !this.state.lastChatKey
          ) {

            firebaseApp.firebase_
              .database()
              .ref(
                `user_conversations/${this.props.userId}/${this.props.chatKey}`
              )
              .transaction(p => {
                if (p) {
                  p.newMessages--;
                }
                return p;
              });
          }
          this.setState({
            messages: _.reverse(_.toArray(snapshot.val())),
            lastChatKey: _.reverse(_.toArray(snapshot.val()))[0].chatKey
          });
          await this.setState({ isLoading: false });
        });
    }
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return null;
  };

  renderItem = ({ item, index }) => {
    const messageProps = {
      previousMessageDate: (this.state.messages[index + 1] || 0).createdAt || 0,
      key: item.messageKey,
      currentMessage: item,
      position: item.user._id === this.props.userId ? "right" : "left"
    };
    return <Message {...messageProps} />;
  };

  keyboardWillShow = event => {
    Animated.parallel([
      Animated.timing(this.state.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height - 40
      })
    ]).start();
  };

  keyboardWillHide = event => {
    Animated.parallel([
      Animated.timing(this.state.keyboardHeight, {
        duration: event.duration,
        toValue: 0
      })
    ]).start();
  };

  onDecline = () => {
    this.setState({ showModal: false });
  };

  onAccept = async () => {
    let typePost = "";
      switch (this.state.postColor) {
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
    const updates = {};
    Analytics.trackEvent("Reveal identity", { Category: typePost });
    const updates = {};
    updates[
      `user_conversations/${this.props.userId}/${this.props.chatKey}/avatar/${
        this.props.userId
      }/avatar`
    ] = this.props.photoURL;

    updates[
      `user_conversations/${this.props.userId}/${this.props.chatKey}/name/${
        this.props.userId
      }`
    ] = {
      firstName: this.props.firstNameMe,
      lastName: this.props.lastNameMe,
      userId: this.props.userId
    };

    updates[
      `user_conversations/${this.props.userId}/${
        this.props.chatKey
      }/lastMessageDate`
    ] =
      firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    updates[
      `user_conversations/${this.props.userId}/${this.props.chatKey}/visible`
    ] =
      "visible_" + new Date().getTime();
    updates[
      `user_conversations/${this.props.userId}/${
        this.props.chatKey
      }/lastMessageText`
    ] = `${this.props.firstNameMe}  ${
      this.props.lastNameMe
    } a accepté de reveler son identité`;

    updates[
      `user_conversations/${this.state.userIdOther}/${
        this.props.chatKey
      }/avatar/${this.props.userId}/avatar`
    ] = this.props.photoURL;

    updates[
      `user_conversations/${this.state.userIdOther}/${
        this.props.chatKey
      }/name/${this.props.userId}`
    ] = {
      firstName: this.props.firstNameMe,
      lastName: this.props.lastNameMe,
      userId: this.props.userId
    };

    updates[
      `user_conversations/${this.state.userIdOther}/${
        this.props.chatKey
      }/lastMessageDate`
    ] =
      firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    updates[
      `user_conversations/${this.state.userIdOther}/${
        this.props.chatKey
      }/visible`
    ] =
      "visible_" + new Date().getTime();
    updates[
      `user_conversations/${this.state.userIdOther}/${
        this.props.chatKey
      }/lastMessageText`
    ] = `${this.props.firstNameMe}  ${
      this.props.lastNameMe
    } a accepté de reveler son identité`;

    await firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.state.userIdOther}/${this.props.chatKey}`)
      .transaction(p => {
        if (p) {
          p.newMessages++;
        }
        return p;
      });

    this.setState({ showModal: false });

    const messageKey = await firebaseApp.firebase_
      .database()
      .ref(`messages/${this.props.chatKey}`)
      .push().key;

    updates[`messages/${this.props.chatKey}/${messageKey}`] = {
      image: this.props.bigPhotoUrl,
      user: {
        _id: this.props.userId
      },
      firstMessage: false,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
      chatKey: this.props.chatKey,
      messageKey,
      avatar: this.props.photoURL,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };

    const messageKey2 = await firebaseApp.firebase_
      .database()
      .ref(`messages/${this.props.chatKey}`)
      .push().key;

    updates[`messages/${this.props.chatKey}/${messageKey2}`] = {
      text: `${this.props.firstNameMe} ${
        this.props.lastNameMe
      } a accepté de reveler son identité`,
      user: {
        _id: this.props.userId
      },
      firstMessage: false,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
      chatKey: this.props.chatKey,
      messageKey: messageKey2,
      avatar: this.props.photoURL,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };

    await firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);

    fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
        include_player_ids: [this.state.oneSignalIdOther],
        headings: {
          en: `${this.props.firstNameMe} ${
            this.props.lastNameMe
          } a accepté de reveler son identité`
        },
        contents: { en: "Clique pour voir sa photo de profil" },
        data: { chatKey: this.props.chatKey }
      })
    })
      .then(responseData => {
        //console.log('Push POST:' + JSON.stringify(responseData))
      })
      .catch(errorData => {
        console.log("Push ERROR:" + JSON.stringify(errorData));
      })
      .done();
  };

  photo = async () => {
    const updates = {};
    this.setState({ loading: true });

    const options = {
      title: "Select Image",
      quality: 0.05,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, async response => {
      this.setState({ loading: false });
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        if (this.state.messages.length === 1) {
          updates[
            `contact/${this.props.userId}/${this.state.postKey}${
              this.state.userIdOther
            }/createdAt`
          ] =
            firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
          updates[
            `contact/${this.props.userId}/${this.state.postKey}${
              this.state.userIdOther
            }/postKey`
          ] =
            this.state.postKey + this.state.userIdOther;

          this.props.addContact(this.state.postKey + this.state.userIdOther);

          fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
              app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
              include_player_ids: [this.state.oneSignalIdOther],
              headings: {
                en:
                  "Nouveau message de " +
                  this.state.firstName +
                  " " +
                  this.state.lastName
              },
              contents: {
                en: "Quelqu'un essaie de vous contacter suite à votre post ..."
              },
              data: { chatKey: this.props.chatKey }
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

        fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            app_id: "3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05",
            include_player_ids: [this.state.oneSignalIdOther],
            headings: {
              en:
                "Nouveau message de " +
                this.state.firstName +
                " " +
                this.state.lastName
            },
            contents: { en: "photo" },
            data: { chatKey: this.props.chatKey }
          })
        })
          .then(responseData => {
            //console.log('Push POST:' + JSON.stringify(responseData))
          })
          .catch(errorData => {
            console.log("Push ERROR:" + JSON.stringify(errorData));
          })
          .done();

        const messageKey = await firebaseApp.firebase_
          .database()
          .ref(`messages/${this.props.chatKey}`)
          .push().key;
        const imageName = `${messageKey}.jpg`;
        const url = await uploadImage(response.uri, imageName);

        updates[`messages/${this.props.chatKey}/${messageKey}`] = {
          image: url,
          user: {
            _id: this.props.userId
          },
          firstMessage: false,
          createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP,
          chatKey: this.props.chatKey,
          messageKey,
          avatar: this.state.avatar,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        };

        updates[
          `user_conversations/${this.state.userIdOther}/${
            this.props.chatKey
          }/lastMessageText`
        ] =
          "photo";
        updates[
          `user_conversations/${this.state.userIdOther}/${
            this.props.chatKey
          }/lastMessageDate`
        ] =
          firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
        updates[
          `user_conversations/${this.state.userIdOther}/${
            this.props.chatKey
          }/visible`
        ] =
          "visible_" + new Date().getTime();

        updates[
          `user_conversations/${this.props.userId}/${
            this.props.chatKey
          }/lastMessageText`
        ] =
          "photo";
        updates[
          `user_conversations/${this.props.userId}/${
            this.props.chatKey
          }/lastMessageDate`
        ] =
          firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
        updates[
          `user_conversations/${this.props.userId}/${
            this.props.chatKey
          }/visible`
        ] =
          "visible_" + new Date().getTime();

        firebaseApp.firebase_
          .database()
          .ref()
          .update(updates);

        await firebaseApp.firebase_
          .database()
          .ref(
            `user_conversations/${this.state.userIdOther}/${this.props.chatKey}`
          )
          .transaction(p => {
            if (p) {
              p.newMessages++;
            }
            return p;
          });
      }
    });
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, { paddingBottom: this.state.keyboardHeight }]}
      >
        <FlatList
          inverted
          ListFooterComponent={this.renderFooter}
          data={this.state.messages}
          renderItem={this.renderItem}
          keyExtractor={item => item.messageKey}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0}
          extraData={this.state}
        />
        <View style={{ flex: 1 }} />
        {this.state.imagePath ? (
          <View
            style={{
              padding: 5,
              marginBottom: 5,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity onPress={() => this.photo()}>
              <Image
                style={styles.list_photo}
                source={require("../assets/icons/picture.png")}
              />
            </TouchableOpacity>
            <TextInput
              multiline
              style={styles.textInput}
              keyboardShouldPersistTaps="handled"
              placeholderTextColor={"gray"}
              value={this.props.textMessage}
              onChangeText={text => this.props.createMessageText(text)}
            />
            <TouchableOpacity onPress={() => this.onSend()}>
              <Image
                style={styles.send}
                source={require("../assets/icons/send.png")}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              padding: 5,
              marginBottom: 5,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity onPress={() => this.photo()}>
              <Image
                style={styles.list_photo}
                source={require("../assets/icons/picture.png")}
              />
            </TouchableOpacity>
            <TextInput
              multiline
              style={styles.textInput}
              keyboardShouldPersistTaps="handled"
              placeholderTextColor={"gray"}
              value={this.props.textMessage}
              onChangeText={text => this.props.createMessageText(text)}
            />
            <TouchableOpacity onPress={() => this.onSend()}>
              <Image
                style={styles.send}
                source={require("../assets/icons/send.png")}
              />
            </TouchableOpacity>
          </View>
        )}

        <Confirm
          visible={this.state.showModal}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
        >
          Êtes-vous sûr de vouloir révéler votre identité?
        </Confirm>
      </Animated.View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "white",
    flex: 1
  },
  detailWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10
  },
  list_photo: {
    height: 25,
    width: 25,
    marginTop: 7,
    marginRight: 20,
    marginLeft: 5
  },
  textInput: {
    fontSize: 16,
    borderWidth: 0.5,
    borderRadius: 20,
    height: 45,
    margin: 2,
    width: 72 + "%",
    padding: 10
  },
  send: {
    height: 25,
    width: 25,
    marginLeft: 7,
    marginTop: 10
  }
};

function mapStateToProps(state) {
  return {
    chatKey: state.chat.chatKey,
    nbMessages: state.chat.nbMessages,
    textMessage: state.messages.textMessage,
    userId: state.auth.userId,
    photoURL: state.auth.photoURL,
    firstNameMe: state.auth.first_name,
    lastNameMe: state.auth.last_name,
    bigPhotoUrl: state.auth.bigPhotoUrl
  };
}

export default connect(
  mapStateToProps,
  actions
)(MessagesScreen);
