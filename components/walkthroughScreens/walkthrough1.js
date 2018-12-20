import React from 'react';
import {
  Image,
  View,
  Text
} from 'react-native';
import { Dimensions, Platform } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export class Walkthrough1 extends React.Component {
  render() {
    const image = <Image style={{width: 88 + "%", height: 95 + "%", marginTop: 20, marginBottom : 5}} source={require('../../assets/images/thumbnail_Mask_Tuto_1.png')}/ >;

    return (
      <View style={styles.screen}>
        {image}
      </View>
    );
  }
}

const styles = {
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
};
