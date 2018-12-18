import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text
} from 'react-native';

export class Walkthrough2 extends React.Component {
  render() {
    const { width } = Dimensions.get('window');
    const image = <Image style={{ width }} source={require('../../assets/images/screensImageDark.png')}/>


    return (
      <View style={styles.screen}>
        {image}
        <Text style={styles.text}>Explore different examples of frequently used pages</Text>
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
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 30
  }
};
