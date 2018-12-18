import _ from "lodash";
import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Button } from "react-native-elements";
import { Walkthrough } from "../components/walkthrough";
import { Walkthrough1 } from "../components/walkthroughScreens/walkthrough1";
import { Walkthrough2 } from "../components/walkthroughScreens/walkthrough2";
import { PaginationIndicator } from "../components/paginationIndicator";
import { Spinner } from "../components/Spinner";

class WelcomeScreen extends Component {
  state = { index: 0, loading: true };

  async componentWillMount() {
    //  await AsyncStorage.setItem('group', 'OiseauxParis');
    const userId = await AsyncStorage.getItem("fb_token");
    if (userId) {
      await this.props.fetchInfoUser();
      const group = await AsyncStorage.getItem("group");
      this.setState({ loading: false });
      if (!group) {
        return this.props.navigation.navigate("group");
      }
      await this.props.setGroup(group);
      this.props.navigation.navigate("map");
      this.setState({ loading: false });
    }
    if (!userId) {
      this.setState({ loading: false });
    }
  }

  onSlidesComplete = () => {
    this.props.navigation.navigate("auth");
  };

  changeIndex(index) {
    this.setState({ index });
  }

  render() {
    return this.state.loading === true ? (
      <View style={styles.screen}>
        <Spinner />
      </View>
    ) : (
      <View style={styles.screen}>
        <Walkthrough onChanged={index => this.changeIndex(index)}>
          <Walkthrough1 />
          <Walkthrough2 />
        </Walkthrough>
        <PaginationIndicator length={2} current={this.state.index} />
        <Button
          large
          buttonStyle={styles.button}
          title="GET STARTED"
          onPress={() => {
            this.onSlidesComplete();
          }}
        />
      </View>
    );
  }
}

const styles = {
  screen: {
    paddingVertical: 28,
    alignItems: "center",
    flex: 1
  },
  button: {
    marginTop: 25,
    marginHorizontal: 16,
    backgroundColor: "rgb(73, 40, 146)",
    width: 300,
    borderRadius: 200
  }
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(WelcomeScreen);
