import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import _ from "lodash";
import "moment/locale/fr";
 import moment from "moment" ;
 import Analytics from "appcenter-analytics";
import { firebaseApp } from "../firebase";
import { connect } from "react-redux";
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

class CommentComments extends Component {
  state = {
    liked: false,
    disliked: false
  };

  componentWillMount() {
    this.testLike();
    this.testDislike();
  }

  componentWillReceiveProps() {
    this.testLike();
    this.testDislike();
  }

  testLike = async () => {
    const isPresent = _.toArray(this.props.data.likes).some(element => {
      return element.userId === this.props.userId;
    });
    if (isPresent) {
      await this.setState({ liked: true });
    }
  };

  testDislike = async () => {
    const isPresent = _.toArray(this.props.data.dislikes).some(element => {
      return element.userId === this.props.userId;
    });
    if (isPresent) {
      await this.setState({ disliked: true });
    }
  };

  likeReact2 = item => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ marginLeft: 120 }}>
          <Text style={styles.likesReact2}>
            {moment(item.createdAt).fromNow()}
          </Text>
        </View>

        <View style={{ marginLeft: 20 }}>
          {this.state.liked ? (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.likesReact2}>unLike</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                this.likeCommentComment(
                  this.props.data.postKey,
                  this.props.group,
                  this.props.data.commentKey,
                  this.props.data.commentsCommentKey
                )
              }
            >
              <Text style={styles.likesReact2}>Like</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  likeCommentComment = async (post, group, comment, commentComment) => {
    Analytics.trackEvent("Like Comment Comment");
    const updates = {};
    this.setState({ liked: true });
    await firebaseApp.firebase_
      .database()
      .ref(
        `/posts_comments/${post}/${comment}/commentsComment/${commentComment}`
      )
      .transaction(p => {
        if (p) {
          p.nbLikes++;
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
        }
        return p;
      });
    updates[
      `/posts_comments/${post}/${comment}/commentsComment/${commentComment}/likes/${
        this.props.userId
      }`
    ] = {
      userId: this.props.userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    };
    updates[`/posts/${group}/${post}/updatedAt`] =
      firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);
  };

  dislikeCommentComment = async (post, group, comment, commentComment) => {
    Analytics.trackEvent("Dislike Comment Comment");
    const updates = {};
    this.setState({ disliked: true });
    await firebaseApp.firebase_
      .database()
      .ref(
        `/posts_comments/${post}/${comment}/commentsComment/${commentComment}`
      )
      .transaction(p => {
        if (p) {
          p.nbLikes--;
          p.updatedAt = firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
        }
        return p;
      });

    updates[
      `/posts_comments/${post}/${comment}/commentsComment/${commentComment}/dislikes/${
        this.props.userId
      }`
    ] = {
      userId: this.props.userId,
      createdAt: firebaseApp.firebase_.database.ServerValue.TIMESTAMP
    };

    updates[`/posts/${group}/${post}/updatedAt`] =
      firebaseApp.firebase_.database.ServerValue.TIMESTAMP;
    firebaseApp.firebase_
      .database()
      .ref()
      .update(updates);
  };

  liked = () => {
    return (
      <Image
        style={{
          height: 20,
          width: 20,
          marginLeft: 5,
          marginTop: 9,
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
          height: 20,
          width: 20,
          marginLeft: 5,
          marginTop: 9,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/like.png")}
      />
    ) : (
      <TouchableOpacity
        onPress={() =>
          this.likeCommentComment(
            this.props.data.postKey,
            this.props.group,
            this.props.data.commentKey,
            this.props.data.commentsCommentKey
          )
        }
      >
        <Image
          style={{
            height: 20,
            width: 20,
            marginLeft: 5,
            marginTop: 9,
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
          height: 20,
          width: 20,
          marginRight: 8,
          marginTop: 9,
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
          height: 20,
          width: 20,
          marginRight: 8,
          marginTop: 9,
          tintColor: this.props.tintColor
        }}
        source={require("../assets/icons/dislike.png")}
      />
    ) : (
      <TouchableOpacity
        onPress={() =>
          this.dislikeCommentComment(
            this.props.data.postKey,
            this.props.group,
            this.props.data.commentKey,
            this.props.data.commentsCommentKey
          )
        }
      >
        <Image
          style={{
            height: 20,
            width: 20,
            marginTop: 9,
            marginRight: 10,
            tintColor: this.props.tintColor
          }}
          source={require("../assets/icons/dislike.png")}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const avatarNb = this.props.data.avatar
      ? this.props.data.avatar.slice(6)
      : null;
    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.comment2}>
          <View style={{ flexDirection: "row" }}>
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
            <Text style={{ marginTop: 10, fontFamily: "Futura" }}>
              {" "}
              {moment(this.props.data.createdAt).fromNow() ===
              "il y a quelques secondes"
                ? "il y a 1s"
                : moment(this.props.data.createdAt).fromNow().replace("minute", "mn")}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            {this.state.liked ? this.liked() : this.unLiked()}
            <Text
              style={{
                fontSize: 20,
                marginTop: 8,
                marginLeft: 7,
                marginRight: 7
              }}
            >
              {this.props.data.nbLikes}
            </Text>
            {this.state.disliked ? this.disliked() : this.unDisliked()}
          </View>
        </View>

        <Text style={{ marginLeft: 60 }}>{this.props.data.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  me: {
    borderWidth: 1,
    borderColor: "red"
  },
  likesReact2: {
    textDecorationLine: "underline",
    fontFamily: "Futura",
    fontWeight: "bold",
    fontSize: 10
  },
  profile_comment: {
    height: 30,
    width: 30,
    marginLeft: 26,
    marginRight: 15,
    marginTop: 3,
    borderRadius: 15
  },
  comment2: {
    flexDirection: "row",
    marginLeft: 30,
    marginBottom: 20,
    justifyContent: "space-between"
  }
});

function mapStateToProps(state) {
  return {
    userId: state.auth.userId,
    group: state.auth.group
  };
}

export default connect(
  mapStateToProps,
  null
)(CommentComments);
