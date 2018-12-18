import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import _ from "lodash";
import moment/locale/fr"; import moment from "moment" ;
import { connect } from "react-redux";
import Lightbox from "react-native-lightbox";
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

class CommentCard extends Component {
  state = {
    liked: false
  };

  componentWillMount() {
    this.testLike();
  }

  componentWillReceiveProps() {
    this.testLike();
  }

  testLike = async () => {
    const userId = await AsyncStorage.getItem("fb_token");
    const isPresent = _.toArray(this.props.data.likes).some(element => {
      return element.userId === userId;
    });
    if (isPresent) {
      await this.setState({ liked: true });
    }
  };

  likeReact = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ marginLeft: 80 }}>
          <Text style={styles.likesReact}>
            {moment(this.props.data.createdAt).fromNow()}
          </Text>
        </View>

        <View style={{ marginLeft: 20 }}>
          {this.state.liked ? (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.likesReact}>unLike</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                this.props.likeComment(
                  this.props.data.postKey,
                  this.props.group,
                  this.props.data.commentKey,
                  this.props.data.oneSignalIdCreator,
                  this.props.oneSignalId
                )
              }
            >
              <Text style={styles.likesReact}>Like</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => this.props.nav(this.props.data.postKey)}
          >
            <Text style={styles.likesReact}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  liked = () => {
    return (
      <TouchableOpacity>
        <Image
          style={{ height: 13, width: 13, marginLeft: 5, marginTop: 5 }}
          source={require("../assets/icons/like2.png")}
        />
      </TouchableOpacity>
    );
  };

  unLiked = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.likeComment(
            this.props.data.postKey,
            this.props.group,
            this.props.data.commentKey,
            this.props.data.oneSignalIdCreator,
            this.props.oneSignalId
          )
        }
      >
        <Image
          style={{ height: 13, width: 13, marginLeft: 5, marginTop: 5 }}
          source={require("../assets/icons/like.png")}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const avatarNb = this.props.data.avatar
      ? this.props.data.avatar.slice(6)
      : null;
    return (
      <View>
        <View style={styles.comment}>
          {this.props.data.userId === this.props.userId ? (
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
          <View style={styles.text_comment}>
            <Text style={styles.text}>{this.props.data.text}</Text>

            {this.props.data.imagePath ? (
              <View style={{ borderRadius: 30, overflow: "hidden" }}>
                <Lightbox
                  activeProps={{
                    style: styles.imageActive
                  }}
                >
                  <Image
                    source={{ uri: this.props.data.imagePath }}
                    resizeMode="contain"
                    style={{
                      height: 200,
                      width: 200,
                      alignSelf: "center",
                      overflow: "hidden"
                    }}
                  />
                </Lightbox>
              </View>
            ) : null}
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 13, marginTop: 5, marginLeft: 5 }}>
                {this.props.data.nbLikes}
              </Text>
              {this.state.liked ? this.liked() : this.unLiked()}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 13, marginTop: 5, marginLeft: 5 }}>
                {this.props.data.nbCommentComments}
              </Text>
              <Image
                style={{ height: 10, width: 14, marginTop: 5, marginLeft: 5 }}
                source={require("../assets/icons/comment.png")}
              />
            </View>
          </View>
        </View>
        {this.likeReact()}
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
    height: 25,
    width: 70 + "%",
    padding: 10
  },
  text_comment: {
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 3,
    padding: 10,
    backgroundColor: "rgb(219,219,219)",
    borderRadius: 20
  },
  profile_comment: {
    height: 30,
    width: 30,
    marginLeft: 26,
    marginRight: 15,
    marginTop: 3,
    borderRadius: 15
  },
  comment: {
    flexDirection: "row",
    margin: 2
  },
  comment2: {
    flexDirection: "row",
    marginLeft: 50,
    paddingRight: 108
  },
  text: {
    marginBottom: 10
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    group: state.auth.group,
    userId: state.auth.userId,
    oneSignalId: state.auth.oneSignalMyId
  };
}

export default connect(
  mapStateToProps,
  actions
)(CommentCard);
