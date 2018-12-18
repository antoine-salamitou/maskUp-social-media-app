import React from 'react';
import {
  Image,
  View,
  Text
} from 'react-native';


export class Walkthrough1 extends React.Component {
  render() {
    const image = <Image source={require('../../assets/images/kittenImageDark.png')}/ >;

    return (
      <View style={styles.screen}>
        {image}
        <Text style={styles.text}>Welcome to Kitten Tricks</Text>
      </View>
    );
  }
}

const styles = {
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  text: {
    marginTop: 20
  }
};
