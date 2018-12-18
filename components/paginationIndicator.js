import React from "react";
import { StyleSheet, View } from "react-native";

export class PaginationIndicator extends React.Component {
  _renderItem(index, selected) {
    let style = [styles.base];
    if (selected) style.push(styles.selected);
    return <View key={index} style={style} />;
  }

  _renderIndicators() {
    let length = this.props.length;
    let current = this.props.current;

    let indicators = [];
    for (let i = 0; i < length; i++) {
      indicators.push(this._renderItem(i, i === current));
    }

    return indicators;
  }

  render() {
    return <View style={styles.container}>{this._renderIndicators()}</View>;
  }
}

let styles = {
  container: {
    flexDirection: "row"
  },
  base: {
    width: 8,
    height: 8,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 5
  },
  selected: {
    backgroundColor: "black"
  }
};
