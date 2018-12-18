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

class ProfileTabIcon extends Component {
  render() {
    return (
      <View>
        <Image
          source={require("../assets/icons/notification.png")}
          style={{ width: 37, height: 37, tintColor: this.props.color }}
        />
        {this.props.profileNotificationCount > 0 ? (
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
              {this.props.profileNotificationCount}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    profileNotificationCount: state.notification.profileNotificationCount
  };
}

export default connect(
  mapStateToProps,
  null
)(ProfileTabIcon);
