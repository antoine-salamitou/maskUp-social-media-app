import React from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet
} from 'react-native';

export class Walkthrough extends React.Component {

  constructor(props) {
    super(props);

    this.onScrollEnd = this.onScrollEnd.bind(this);
  }

  renderItem = ({ item }) => {
    const { width } = Dimensions.get('window');
    return (
      <View style={[styles.item, { width }]}>
        {item}
      </View>
    );
  };

  //on utilise la fonction qu'on a passé dans welcome screen pour set le state index
  onScrollEnd(e) {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (this.props.onChanged) {
      this.props.onChanged(pageNum);
    }
  }

  render() {
    const items = this.props.children;
    return (
      <FlatList
        style={styles.list}
        data={items}
        onMomentumScrollEnd={this.onScrollEnd}
        pagingEnabled={true}
        horizontal
        renderSeparator={() => null}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        renderItem={this.renderItem}
      />
    );
  }
}

let styles = StyleSheet.create({
  list: {
    flex: 1
  },
  item: {
    flex: 1,
  }
});
