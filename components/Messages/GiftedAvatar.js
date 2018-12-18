/* eslint no-use-before-define: ["error", { "variables": false }], padded-blocks: 0 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Color from './Color';

const IMAGES = [
  require(`../../assets/images/avatar1.png`),
  require(`../../assets/images/avatar2.png`),
  require(`../../assets/images/avatar3.png`),
  require(`../../assets/images/avatar4.png`),
  require(`../../assets/images/avatar5.png`),
  require(`../../assets/images/avatar6.png`),
  require(`../../assets/images/avatar7.png`),
  require(`../../assets/images/avatar8.png`),
];

export default class GiftedAvatar extends Component {
/*  setAvatarColor() {
    const userName = this.props.user.name || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

    this.avatarColor = colors[sumChars % colors.length];
  }*/

  renderAvatar() {
  const avatarNb = isNaN(this.props.avatar.slice(6)) ? this.props.avatar : this.props.avatar.slice(6);
      return (
        isNaN(avatarNb) ?
          <Image
            source={{ uri: avatarNb }}
            style={[styles.avatarStyle, this.props.avatarStyle]}
          />
          :
        <Image
          source={IMAGES[avatarNb - 1]}
          style={[styles.avatarStyle, this.props.avatarStyle]}
        />

      );
  }

/*  renderInitials() {
    return <Text style={[styles.textStyle, this.props.textStyle]}>{this.avatarName}</Text>;
  }*/

  render() {
      const avatarNb = isNaN(this.props.avatar.slice(6)) ? this.props.avatar : this.props.avatar.slice(6);
          return (
            isNaN(avatarNb) ?
              <Image
                source={{ uri: avatarNb }}
                style={[styles.avatarStyle, this.props.avatarStyle]}
              />
              :
            <Image
              source={IMAGES[avatarNb - 1]}
              style={[styles.avatarStyle, this.props.avatarStyle]}
            />

          );
  }
}

const styles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarTransparent: {
    backgroundColor: Color.backgroundTransparent,
  },
  textStyle: {
    color: Color.white,
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '100',
  },
};

GiftedAvatar.defaultProps = {
  user: {
    name: null,
    avatar: null,
  },
  onPress: null,
  avatarStyle: {},
  textStyle: {},
};

GiftedAvatar.propTypes = {
  user: PropTypes.object,
  onPress: PropTypes.func,
  avatarStyle: Image.propTypes.style,
  textStyle: Text.propTypes.style,
};
