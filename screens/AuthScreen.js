import React, { Component } from "react";
import { View, Text, AsyncStorage, Image } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { firebaseApp } from "../firebase";
import * as actions from "../actions";
import { Spinner } from "../components/Spinner";

class AuthScreen extends Component {
  componentWillReceiveProps = async nextProps => {
    this.onAuthComplete(nextProps);
  };

  onAuthComplete(props) {
    if (props.userId) {
      this.props.navigation.navigate("group");
    }
  }

  onFBButtonPress = () => {
    this.props.loginFacebook();
  };

  render() {
    const image = (
      <Image source={require("../assets/images/kittenImageDark.png")} />
    );
    return this.props.loading === true ? (
      <View style={styles.screen}>
        <Spinner />
      </View>
    ) : (
      <View style={styles.screen}>
        {image}
        <Button
          buttonStyle={styles.FBbutton}
          onPress={this.onFBButtonPress}
          title="Continue with Facebook"
        />
      </View>
    );
  }
}

const styles = {
  screen: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  FBbutton: {
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: "rgb(73, 40, 146)",
    width: 300,
    borderRadius: 200
  }
};

function mapStateToProps({ auth }) {
  return { userId: auth.userId, loading: auth.loading };
}

export default connect(
  mapStateToProps,
  actions
)(AuthScreen);
