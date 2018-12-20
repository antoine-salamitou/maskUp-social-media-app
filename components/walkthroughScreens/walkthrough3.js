import React from "react";
import { StyleSheet, Image, View, Dimensions, Text } from "react-native";

export class Walkthrough3 extends React.Component {
  render() {
    const { width } = Dimensions.get("window");
    const image = (
      <Image
        style={{
          width: 88 + "%",
          height: 95 + "%",
          marginTop: 20,
          marginBottom: 5
        }}
        source={require("../../assets/images/thumbnail_Mask_Tuto_3.png")}
      />
    );

    return <View style={styles.screen}>{image}</View>;
  }
}

const styles = {
  screen: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  text: {
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 30
  }
};
