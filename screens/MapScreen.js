import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Text
} from "react-native";
import { firebaseApp } from "../firebase";
import Analytics from 'appcenter-analytics';
import OneSignal from "react-native-onesignal";

import Card from "../components/Card";
import CreatePost from "../components/CreatePost";
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../actions";
import { Spinner } from "../components/Spinner";

const screenWidth = Dimensions.get("window").width;

class MapScreen extends Component {
  state = {
    isLoading: false,
    isEmpty: false,
    isFinished: false,
    counter: 7,
    thisArguments: [],
    onEndReachedCalledDuringMomentum: true
  };

componentWillMount() {

    OneSignal.init("3bdabd6a-1c24-4e3d-a287-4b8fe38f3e05");
    OneSignal.registerForPushNotifications();
    OneSignal.configure();
    OneSignal.addEventListener("ids", this.onPermissionGranted);

    OneSignal.inFocusDisplaying(0);
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    this.props.fetchContact();
    this.fetchData();
  }

  componentDidUpdate() {
    //  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  componentDidMount() {}

  componentWillReceiveProps = async nextProps => {
    if (nextProps.group && !this.props.group) {
      OneSignal.registerForPushNotifications();
      OneSignal.configure();
    }

    if (
      !nextProps.auth.first_name &&
      !nextProps.auth.last_name &&
      !nextProps.auth.group &&
      this.props.group
    ) {
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.group}`)
        .off();
    }
    if (!this.props.group && nextProps.auth.group) {
      this.setState({
        isLoading: false,
        isEmpty: false,
        isFinished: false,
        counter: 7,
        thisArguments: [],
        onEndReachedCalledDuringMomentum: true
      });
      this.data = [];
      let i = 0;
      let lastPushDate = 0;
      await firebaseApp.firebase_
        .database()
        .ref(`/posts/${nextProps.auth.group}`)
        .orderByChild("createdAt")
        .limitToLast(this.state.counter)
        .on("child_added", async snapshot => {
          await this.setState({ isLoading: true });
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

      await firebaseApp.firebase_
        .database()
        .ref(`/posts/${nextProps.auth.group}`)
        .orderByChild("createdAt")
        .limitToLast(this.state.counter)
        .on("child_changed", async snapshot => {
          if (snapshot.val().nbLikes <= -3) {
            this.data = this.data.filter(x => x.id !== snapshot.key);
          } else {
            this.data.forEach((element, index) => {
              if (element.id === snapshot.key) {
                this.data[index] = {
                  id: snapshot.key,
                  postData: snapshot.val()
                };
              }
            });
          }
          await this.setState({
            thisArguments: this.data
          });
        });

      await firebaseApp.firebase_
        .database()
        .ref(`/posts/${nextProps.auth.group}`)
        .orderByChild("createdAt")
        .limitToLast(this.state.counter)
        .on("child_removed", async snapshot => {
          this.data = this.data.filter(x => x.id !== snapshot.key);
          await this.setState({
            thisArguments: this.data
          });
        });
    }
  };

  componentWillUnmount() {
    OneSignal.removeEventListener("ids", this.onPermissionGranted);
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.auth.group}`)
      .off();
  }

  onPermissionGranted = element => {
    const updates = {};
    updates[`/one_signal_ids/${this.props.userId}`] = {
      oneSignalId: element.userId
    };

    updates[`/group/${this.props.group}/${this.props.userId}`] = {
      oneSignalId: element.userId,
      userId: this.props.userId
    };
    updates[`users/${this.props.userId}/oneSignalId`] = element.userId;
    firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);
    this.props.oneSignal(element.userId);
  };

  onReceived = notification => {
    /*   if (notification.payload.title === 'New message from') {
       this.props.newMessageNotification();
    }*/
  };

  onOpened = openResult => {
    if (openResult.notification.payload.additionalData) {
      if (openResult.notification.payload.additionalData.chatKey) {
        this.props.goToChat(
          openResult.notification.payload.additionalData.chatKey
        );
        this.props.navigation.navigate("messages");
      }
      if (openResult.notification.payload.additionalData.postKey) {
        this.props.goToPost(
          openResult.notification.payload.additionalData.postKey
        );
        this.props.navigation.navigate("comment");
      }
    }
  };

  onEndReached = async () => {
    if (
      !this.state.isEmpty &&
      !this.state.isFinished &&
      !this.state.isLoading &&
      !this.state.onEndReachedCalledDuringMomentum
    ) {
      await this.setState({ counter: this.state.counter + 3 });
      await this.setState({ isLoading: true });
      firebaseApp.firebase_
        .database()
        .ref(`/posts/${this.props.auth.group}`)
        .off();
      this.data = [];
      this.childAdded();
      this.childRemovedOrUpdated();
    }
  };

  fetchData = async () => {
    this.data = [];
    this.childAdded();
    this.childRemovedOrUpdated();
  };

  childAdded = async () => {
    let i = 0;
    let lastPushDate = 0;

    await firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.auth.group}`)
      .orderByChild("createdAt")
      .limitToLast(this.state.counter)
      .on("child_added", async snapshot => {
        this.setState({ isLoading: true });
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

  childRemovedOrUpdated = async () => {
    await firebaseApp.firebase_
      .database()
      .ref(`/posts/${this.props.auth.group}`)
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
      .ref(`/posts/${this.props.auth.group}`)
      .orderByChild("createdAt")
      .limitToLast(this.state.counter)
      .on("child_removed", async snapshot => {
        this.data = this.data.filter(x => x.id !== snapshot.key);
        await this.setState({
          thisArguments: this.data
        });
      });
  };

  navigateToConversation = item => {
    this.props.goToPost(item);
    this.props.navigation.navigate("comment");
  };

  navigateToMessages = () => {
    this.props.navigation.navigate("messages");
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return null;
  };

  renderItem = item => (
    <Card
      data={item.item}
      nav={this.navigateToConversation}
      navMessages={this.navigateToMessages}
    />
  );

  renderModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.modal}
      >
        <CreatePost closeModal={() => this.props.postFinished()} />
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => this.props.openModal("red")}>
            <Image
              style={styles.iconHeart}
              source={require("../assets/icons/like2.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.openModal("yellow")}>
            <Image
              style={styles.iconHeart}
              source={require("../assets/icons/promotion.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.openModal("blue")}>
            <Image
              style={styles.iconHeart}
              source={require("../assets/icons/avatar.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.openModal("green")}>
            <Image
              style={styles.iconHeart}
              source={require("../assets/icons/hush.png")}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.thisArguments}
          extraData={this.state}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
          keyExtractor={item => item.postData.postKey}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0}
          onMomentumScrollBegin={() => {
            this.setState({ onEndReachedCalledDuringMomentum: false });
          }}
        />

        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    //      backgroundColor: 'rgb(255, 250, 240)',
    paddingTop: 20,
    flex: 1
  },
  profile: {
    marginRight: 20,
    backgroundColor: "black",
    height: 40,
    width: 40
  },
  card: {
    marginVertical: 8
  },
  post: {
    marginTop: 13
  },
  iconHeart: {
    height: 85,
    width: 85,
    marginLeft: screenWidth / 52,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  viewHeart: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 30,
    marginLeft: 30
  },
  viewPromotion: {
    borderWidth: 1,
    borderColor: "green",
    padding: 10,
    borderRadius: 30,
    marginLeft: 30
  },
  viewHush: {
    borderWidth: 1,
    borderColor: "blue",
    padding: 10,
    borderRadius: 30,
    marginLeft: 30
  },
  viewAvatar: {
    borderWidth: 1,
    borderColor: "yellow",
    padding: 10,
    borderRadius: 30,
    marginLeft: 30
  }
});

function mapStateToProps(state) {
  return {
    auth: state.auth,
    modal: state.createPost.modal,
    userId: state.auth.userId,
    group: state.auth.group,
    oneSignalId: state.auth.oneSignalMyId
  };
}

export default connect(
  mapStateToProps,
  actions
)(MapScreen);
