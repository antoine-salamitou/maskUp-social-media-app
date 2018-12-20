import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  AsyncStorage,
  Linking,
  Modal
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { firebaseApp } from "../firebase";
import "moment/locale/fr";
import moment from "moment";
import { Header } from "react-native-elements";
import { Confirm } from "../components/Confirm";
import { PopUpMenu } from "../components/PopUpMenu";
import { Confidentialite } from "../components/Confidentialite";
import { PrivacyPolicy } from "../components/PrivacyPolicy";
import * as actions from "../actions";

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

class ProfileScreen extends Component {
  state = {
    notifs: [],
    counter: 10,
    isFinished: true,
    isLoading: false,
    isEmpty: false,
    showModal: false,
    showModal2: false,
    showModal3: false,
    showModal4: false,
    marginTopHeader: 0
  };

  async componentWillMount() {
    const test = await this.props.isIphoneXorAbove();
    if (test === true) {
      this.setState({ marginTopHeader: 20 });
    }
    moment.locale("fr");
    firebaseApp.firebase_
      .database()
      .ref(`/notifications/${this.props.userId}/${this.props.group}`)
      .limitToLast(this.state.counter)
      .on("value", async snapshot => {
        if (_.toArray(snapshot.val()).length === this.state.counter) {
          await this.setState({ isFinished: false });
        }

        let nbProfileNotif = 0;
        _.toArray(snapshot.val()).forEach(element => {
          if (element.new === true) {
            nbProfileNotif++;
          }
        });
        this.props.profileNotif(nbProfileNotif);

        this.setState({
          notifs: _.reverse(_.toArray(snapshot.val()))
        });
      });
  }

  componentWillUnmount() {
    firebaseApp.firebase_
      .database()
      .ref(`/notifications/${this.props.userId}/${this.props.group}`)
      .off();
  }

  componentWillReceiveProps = async nextProps => {
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
    if (!this.props.group && nextProps.group) {
      await this.setState({
        notifs: [],
        counter: 40,
        isFinished: true,
        isLoading: false,
        isEmpty: false,
        showModal: false
      });
    }

    firebaseApp.firebase_
      .database()
      .ref(`/notifications/${this.props.userId}/${nextProps.group}`)
      .limitToLast(this.state.counter)
      .on("value", async snapshot => {
        if (_.toArray(snapshot.val()).length === this.state.counter) {
          await this.setState({ isFinished: false });
        }

        let nbProfileNotif = 0;
        _.toArray(snapshot.val()).forEach(element => {
          if (element.new === true) {
            nbProfileNotif++;
          }
        });
        this.props.profileNotif(nbProfileNotif);

        this.setState({
          notifs: _.reverse(_.toArray(snapshot.val()))
        });
      });
  };

  onEndReached = async () => {
    if (
      !this.state.isEmpty &&
      !this.state.isFinished &&
      !this.state.isLoading
    ) {
      await this.setState({ counter: this.state.counter + 20 });
      await this.setState({ isLoading: true });
      this.props.restartProfileNotif();
      firebaseApp.firebase_
        .database()
        .ref(`/notifications/${this.props.userId}/${this.props.group}`)
        .off();
      firebaseApp.firebase_
        .database()
        .ref(`/notifications/${this.props.userId}/${this.props.group}`)
        .limitToLast(this.state.counter)
        .on("value", async snapshot => {
          if (_.toArray(snapshot.val()).length !== this.state.counter) {
            await this.setState({ isFinished: true });
          }

          let nbProfileNotif = 0;
          _.toArray(snapshot.val()).forEach(element => {
            if (element.new === true) {
              nbProfileNotif++;
            }
          });
          this.props.profileNotif(nbProfileNotif);

          this.setState({
            notifs: _.reverse(_.toArray(snapshot.val()))
          });
        });
    }
  };

  pressNotif = (notificationKey, postKey) => {
    firebaseApp.firebase_
      .database()
      .ref(
        `notifications/${this.props.userId}/${
          this.props.group
        }/${notificationKey}`
      )
      .update({
        new: false
      });
    this.props.goToPost(postKey);
    this.props.navigation.navigate("comment");
  };

  onDecline = () => {
    this.setState({ showModal: false });
  };

  onDecline2 = () => {
    this.setState({ showModal2: false });
  };

  onAccept = async () => {
    await this.setState({ showModal: false });
    this.logOut();
  };

  onPressButon1 = () => {
    Linking.openURL(
      "mailto:contactezmask@gmail.com?subject=Suggestion&body=N'hésite pas à nous envoyer tes problèmes ou suggestions pour Mask !"
    );
  };

  renderItem = item => {
    const avatarNb = isNaN(item.item.avatar.slice(6))
      ? item.item.avatar
      : item.item.avatar.slice(6);
    return (
      <TouchableOpacity
        onPress={() =>
          this.pressNotif(item.item.notificationKey, item.item.postKey)
        }
      >
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.RawContainer}>
                <View style={styles.RawContainer2}>
                  <Image style={styles.profile} source={IMAGES[avatarNb - 1]} />
                  {item.item.statut === "nouveauPost" ? (
                    <View style={styles.LeftContainer}>
                      <Text style={styles.title}>
                        a écrit un nouveau post : "{item.item.text.length > 10
                          ? item.item.text.slice(0, 10) + "..."
                          : item.item.text}"
                      </Text>
                    </View>
                  ) : null}
                  {item.item.statut === "nouveauCommentaire" ? (
                    <View style={styles.LeftContainer}>
                      <Text style={styles.title}>
                        a répondu à votre post : "{item.item.text.length > 10
                          ? item.item.text.slice(0, 10) + "..."
                          : item.item.text}"{" "}
                      </Text>
                    </View>
                  ) : null}
                  {item.item.statut === "nouveauCommentaireCommentaire" ? (
                    <View style={styles.LeftContainer}>
                      <Text style={styles.title}>
                        a répondu à votre commentaire : "{item.item.text
                          .length > 10
                          ? item.item.text.slice(0, 10) + "..."
                          : item.item.text}"{" "}
                      </Text>
                    </View>
                  ) : null}

                  {item.item.statut === "nouveauLike" ? (
                    <View style={styles.LeftContainer}>
                      <Text style={styles.title}>a liké votre post</Text>
                    </View>
                  ) : null}
                </View>
                <View>
                  {item.item.new ? (
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
            </View>
            <View style={styles.RightContainer}>
              <Text style={styles.author}>
                {moment(item.item.createdAt).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  logOut = async () => {
    AsyncStorage.clear();
    this.props.disconnect();
    this.props.navigation.navigate("welcome");
  };

  onPressButon2 = async () => {
    await this.setState({ showModal2: false });
    this.setState({ showModal3: true });
  };

  onPressButon3 = async () => {
    await this.setState({ showModal2: false });
    this.setState({ showModal4: true });
  };

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Header
          backgroundColor="white"
          marginBottom={3}
          leftComponent={{
            icon: "exit-to-app",
            color: "black",
            size: 30,
            onPress: () => this.setState({ showModal: true })
          }}
          rightComponent={{
            icon: "settings",
            color: "black",
            size: 30,
            onPress: () => this.setState({ showModal2: true })
          }}
          centerComponent={{
            text: "Notifications",
            style: { color: "black", fontSize: 17, fontWeight: "bold" }
          }}
          outerContainerStyles={{
            borderBottomColor: "#FF1744",
            borderBottomWidth: 1,
            marginTop: this.state.marginTopHeader
          }}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.notifs}
            renderItem={this.renderItem}
            keyExtractor={item => item.notificationKey}
            extraData={this.state}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0}
          />
        </View>
        <Confirm
          visible={this.state.showModal}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
        >
          Vous êtes sûr?
        </Confirm>
        <PopUpMenu
          visible={this.state.showModal2}
          onPressButon1={this.onPressButon1}
          onPressButon2={this.onPressButon2}
          onPressButon3={this.onPressButon3}
          Button1Text="Nous contacter"
          Button2Text="Voir les conditions générales"
          Button3Text="Voir la politique de confidentialité"
          onDecline={this.onDecline2}
        />
        <Modal visible={this.state.showModal3}>
          <Confidentialite
            closeModal={() => {
              this.setState({ showModal3: false });
            }}
            visible={this.state.showModal3}
          />
        </Modal>

        <Modal visible={this.state.showModal4}>
          <PrivacyPolicy
            closeModal2={() => {
              this.setState({ showModal4: false });
            }}
            visible={this.state.showModal4}
          />
        </Modal>
      </View>
    );
  }
}

const styles = {
  info: {
    padding: 8,
    marginLeft: 35,
    fontSize: 13
  },
  profile: {
    height: 20,
    width: 20,
    borderRadius: 5,
    margin: 10
  },
  card: {
    flex: 1,
    margin: 2,
    backgroundColor: "rgb(255, 109, 109)",
    marginBottom: 3
  },
  RawContainer: {
    flexDirection: "row",
    flex: 1
    //borderWidth: 1,
  },
  RawContainer2: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around"
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
  }
};

function mapStateToProps(state) {
  return {
    userId: state.auth.userId,
    group: state.auth.group,
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(ProfileScreen);
