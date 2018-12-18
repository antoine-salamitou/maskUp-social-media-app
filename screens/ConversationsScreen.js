import React, { Component } from "react";
import {
  Text,
  AsyncStorage,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { Icon } from "react-native-elements";
import _ from "lodash";
import { firebaseApp } from "../firebase";
import { connect } from "react-redux";
import * as actions from "../actions";

import "moment/locale/fr";
 import moment from "moment" ;

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

class ConversationsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "mask chat",
      headerTitleStyle: {
        color: "black"
      },
      headerStyle: {
        backgroundColor: "white",
        borderBottomColor: "#FF1744",
        borderBottomWidth: 1,
        marginBottom: 3
      }
    };
  };

  state = {
    isEmpty: false,
    isLoading: true,
    isFinished: false,
    thisArguments: [],
    counter: 10,
    onEndReachedCalledDuringMomentum: true
  };

  async componentWillMount() {
    this.data = [];
    let lastMessageDate = "";
    let i = 0;
    await firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}`)
      .limitToLast(this.state.counter)
      .orderByChild("visible")
      .startAt("visible_0")
      .on("child_added", async snapshot => {
        i += 1;
        if (snapshot.val().newMessages !== 0) {
          this.props.newMessageNotification();
        }
        this.data.unshift({ id: snapshot.key, postData: snapshot.val() });
        await this.setState({
          thisArguments: this.data
        });
        await this.setState({ isLoading: false });
        if (i < this.state.counter) {
          this.setState({ isFinished: true });
        }
      });

    await firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}`)
      .orderByChild("visible")
      .startAt("visible_0")
      .on("child_changed", async snapshot => {
        console.log(snapshot.val().newMessages === 1);
        console.log(snapshot.val().chatKey !== this.props.chatKey);
        console.log(
          this.data.find(x => x.id === snapshot.val().chatKey).postData
            .lastMessageDate >= snapshot.val().lastMessageDate
        );

        if (
          snapshot.val().newMessages === 1 &&
          !(snapshot.val().chatKey === this.props.chatKey &&
            this.props.chatOpened === true) &&
          this.data.find(x => x.id === snapshot.val().chatKey).postData
            .lastMessageDate >= snapshot.val().lastMessageDate
        ) {
          console.log('b')
          this.props.newMessageNotification();
        }
        if (
          _.head(this.state.thisArguments).postData.lastMessageDate >
          snapshot.val().lastMessageDate
        ) {
          await this.data.forEach((element, index) => {
            if (element.id === snapshot.key) {
              this.data[index] = { id: snapshot.key, postData: snapshot.val() };
            }
          });
          await this.setState({
            thisArguments: this.data
          });
        } else {
          this.data = await this.data.filter(x => x.id !== snapshot.key);
          await this.data.unshift({
            id: snapshot.key,
            postData: snapshot.val()
          });
          await this.setState({
            thisArguments: this.data
          });
        }
      });
  }

  async componentWillUnmount() {
    firebaseApp.firebase_
      .database()
      .ref(`user_conversations/${this.props.userId}`)
      .off();
  }

  navigateToChat = (chatKey, nbMessages) => {
    this.props.newMessages(nbMessages);
    this.props.goToChat(chatKey);
    this.props.navigation.navigate("messages");
  };

  onEndReached = async () => {
    if (
      !this.state.isEmpty &&
      !this.state.isFinished &&
      !this.state.isLoading &&
      !this.state.onEndReachedCalledDuringMomentum
    ) {
      this.props.restartMessageNotifications();
      await this.setState({ counter: this.state.counter + 5 });
      await this.setState({ isLoading: true });
      let i = 0;
      this.data = [];
      firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}`)
        .off();
      await firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}`)
        .limitToLast(this.state.counter)
        .orderByChild("visible")
        .startAt("visible_0")
        .on("child_added", async snapshot => {
          i += 1;
          if (snapshot.val().newMessages !== 0) {
            this.props.newMessageNotification();
          }
          this.data.unshift({ id: snapshot.key, postData: snapshot.val() });
          await this.setState({
            thisArguments: this.data
          });
          await this.setState({ isLoading: false });
          if (i < this.state.counter) {
            this.setState({ isFinished: true });
          }
        });
      await firebaseApp.firebase_
        .database()
        .ref(`user_conversations/${this.props.userId}`)
        .orderByChild("visible")
        .startAt("visible_0")
        .on("child_changed", async snapshot => {
          if (
            snapshot.val().newMessages === 1 &&
            !(snapshot.val().chatKey === this.props.chatKey &&
              this.props.chatOpened === true) &&
            this.data.find(x => x.id === snapshot.val().chatKey).postData
              .lastMessageDate >= snapshot.val().lastMessageDate
          ) {
            this.props.newMessageNotification();
          }
          if (
            _.head(this.state.thisArguments).postData.lastMessageDate >
            snapshot.val().lastMessageDate
          ) {
            await this.data.forEach((element, index) => {
              if (element.id === snapshot.key) {
                this.data[index] = {
                  id: snapshot.key,
                  postData: snapshot.val()
                };
              }
            });
            await this.setState({
              thisArguments: this.data
            });
          } else {
            this.data = await this.data.filter(x => x.id !== snapshot.key);
            await this.data.unshift({
              id: snapshot.key,
              postData: snapshot.val()
            });
            await this.setState({
              thisArguments: this.data
            });
          }
        });
    }
  };

  renderItem = item => {
    let avatar = "";
    let firstName = "";
    let lastName = "";
    _.toArray(item.item.postData.avatar).forEach(element => {
      if (element.userId !== this.props.userId) {
        avatar = element.avatar;
      }
    });
    const avatarNb = isNaN(avatar.slice(6)) ? avatar : avatar.slice(6);
    _.toArray(item.item.postData.name).forEach(element => {
      if (element.userId !== this.props.userId) {
        firstName = element.firstName;
        lastName = element.lastName;
      }
    });
    return (
      <TouchableOpacity
        onPress={() =>
          this.navigateToChat(item.item.id, item.item.postData.newMessages)
        }
      >
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <View style={styles.RawContainer}>
              {isNaN(avatarNb) ? (
                <View>
                  <Image style={styles.profile} source={{ uri: avatarNb }} />
                </View>
              ) : (
                <View>
                  <Image style={styles.profile} source={IMAGES[avatarNb - 1]} />
                </View>
              )}
              {firstName === "Anonyme" ? (
                <View style={styles.LeftContainer}>
                  <Text style={styles.title}>
                    Anonyme : "{item.item.postData.postText.length > 10
                      ? this.renderText(item.item.postData.postText).slice(
                          0,
                          10
                        ) + "..."
                      : item.item.postData.postText}"
                  </Text>
                </View>
              ) : (
                <View style={styles.LeftContainer}>
                  <Text style={styles.title}>
                    {firstName} {lastName}
                  </Text>
                </View>
              )}
              <View>
                {item.item.postData.newMessages !== 0 ? (
                  <View style={{ flex: 1, marginRight: 10, marginTop: 14 }}>
                    <View
                      style={{
                        borderRadius: 80,
                        width: 13,
                        height: 13,
                        backgroundColor: "white"
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
            <View style={styles.RawContainer}>
              <View style={styles.LeftContainer}>
                <Text style={styles.info}>
                  {item.item.postData.lastMessageText.length > 90
                    ? item.item.postData.lastMessageText.slice(0, 90) + "..."
                    : item.item.postData.lastMessageText}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.RightContainer}>
            <Text style={styles.author}>
              {moment(item.item.postData.lastMessageDate).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderText = text => {
    if (!text) {
      return "image";
    }
    return text.length > 40 ? text.slice(0, 40) + "..." : text;
  };

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <FlatList
          data={this.state.thisArguments}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          extraData={this.state}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0}
          onMomentumScrollBegin={() => {
            this.setState({ onEndReachedCalledDuringMomentum: false });
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  RawContainer: {
    flexDirection: "row",
    flex: 1
    //borderWidth: 1,
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
    //borderWidth: 1,
  },
  RightContainer: {
    justifyContent: "center",
    alignItems: "flex-end"
    //borderWidth: 1,
  },
  CounterContainer: {
    justifyContent: "center",
    alignItems: "center",
    //borderWidth: 1,
    height: 23,
    width: 23,
    borderRadius: 90,
    marginRight: 25
  },
  counter: {
    fontSize: 16,
    fontWeight: "200",
    color: "#FFF"
  },
  card: {
    flex: 1,
    margin: 2,
    backgroundColor: "rgb(255, 109, 109)",
    marginBottom: 3
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
    color: "white"
  },
  author: {
    fontSize: 14,
    padding: 5,
    color: "white"
  },
  info: {
    padding: 8,
    fontSize: 13,
    marginLeft: 35,
    color: "white"
  },
  profile: {
    height: 20,
    width: 20,
    borderRadius: 5,
    margin: 10
  }
});

function mapStateToProps(state) {
  return {
    userId: state.auth.userId,
    chatKey: state.chat.chatKey,
    chatOpened: state.chat.chatOpened
  };
}

export default connect(
  mapStateToProps,
  actions
)(ConversationsScreen);
