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
import { connect } from "react-redux";

class ConversationTabIcon extends Component {
  render() {
    return (
      <View>
        <Image
          source={require("../assets/icons/mail.png")}
          style={{ width: 37, height: 37, tintColor: this.props.color }}
        />
        {this.props.notificationCount > 0 ? (
          <View
            style={{
              position: "absolute",
              right: 27,
              top: 0,
              backgroundColor: "red",
              borderRadius: 9,
              width: 18,
              height: 18,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white" }}>
              {this.props.notificationCount}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    text: state.createPost.text,
    group: state.auth.group,
    notificationCount: state.notification.notificationCount
  };
}

export default connect(
  mapStateToProps,
  null
)(ConversationTabIcon);
