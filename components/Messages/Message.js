/* eslint no-use-before-define: ["error", { "variables": false }], react-native/no-inline-styles: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { View, ViewPropTypes, StyleSheet, Text, Image } from 'react-native';
import moment from 'moment';
import Lightbox from 'react-native-lightbox';
import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import Day from './Day';

import { isSameUser, isSameDay } from './utils';



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

export default class Message extends React.Component {

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
    };
  }

  renderDay() {
    if (this.props.currentMessage.createdAt - this.props.previousMessageDate > 519457600) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  }

  renderFirstMessage = () => {
      const avatarNb = this.props.currentMessage.avatar ? this.props.currentMessage.avatar.slice(6) : null;
      const avatarNb2 = this.props.currentMessage.avatarComment ? this.props.currentMessage.avatarComment.slice(6) : null;
    return (
      <View style={[{ flex: 1, borderWidth: 0.5, borderRadius: 20 }, styles[this.props.position].firstMessage]}>
        <View style={styles.avatarContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.profile} source={IMAGES[avatarNb - 1]} />
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{moment(this.props.currentMessage.createdAt).fromNow()}</Text>
            </View>
          </View>
          <View style={styles.row}>
              <Image style={{ height: 20, width: 20, marginRight: 5 }} source={require('../../assets/icons/like.png')} />
            <Text style={{ fontSize: 17, marginRight: 5 }}>{this.props.currentMessage.nbLikes}</Text>
            <Image style={{ height: 20, width: 20}} source={require('../../assets/icons/dislike.png')} />
          </View>

      </View>
      <View style={styles.content}>
      {this.props.currentMessage.image ?
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}
        >
        <Image
          source={{ uri: this.props.currentMessage.image }}
          resizeMode='contain'
          style={{
            height: 200,
            width: 200,
          }}
        />
        </Lightbox>
        :
        null
      }
        <Text>{this.props.currentMessage.text}</Text>
      </View>

      <View style={styles.likes}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.row}>
            <Image style={{ height: 20, width: 20, marginRight: 5, marginTop: 2 }} source={require('../../assets/icons/comment.png')} />
            <Text style={{ fontSize: 17 }}>{this.props.currentMessage.nbComments}</Text>
          </View>
        </View>
      </View>

      { this.props.currentMessage.textComment ?
      <View style={[styles.likes, { marginTop: 4 }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.row}>
            <Image style={{ height: 20, width: 20, marginRight: 10, marginTop: 2, marginLeft: 20 }} source={IMAGES[avatarNb2 - 1]} />
            <Text style={{ fontSize: 17, marginTop: 3 }}>{this.props.currentMessage.textComment.length > 18 ? this.props.currentMessage.textComment.slice(0, 18) + '...' : this.props.currentMessage.textComment}</Text>
          </View>
        </View>
      </View>
      :
      null
    }

    </View>

  );
  }

  renderBubble() {
    if (this.props.currentMessage.firstMessage) {
      return (
        this.renderFirstMessage()
      );
    }
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} />;
  }

  renderSystemMessage() {
    const systemMessageProps = this.getInnerComponentProps();
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(systemMessageProps);
    }
    return <SystemMessage {...systemMessageProps} />;
  }

  renderAvatar() {
    if (this.props.user._id === this.props.currentMessage.user._id && !this.props.showUserAvatar) {
      return null;
    }
    const avatarProps = this.getInnerComponentProps();
    const { currentMessage } = avatarProps;
    if (currentMessage.user.avatar === null) {
      return null;
    }
    return <Avatar {...avatarProps} />;
  }

  render() {
    return (
      <View>
        {this.renderDay()}
        {this.props.currentMessage.system ? (
          this.renderSystemMessage()
        ) : (
          <View
            style={[
              styles[this.props.position].container,
              { marginBottom: 7 },
              !this.props.inverted && { marginBottom: 2 },
              this.props.containerStyle[this.props.position],
            ]}
          >
            {this.props.position === 'left' ? this.renderAvatar() : null}
            {this.renderBubble()}
            {this.props.position === 'right' ? this.renderAvatar() : null}
          </View>
        )}
      </View>
    );
  }

}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
    firstMessage: {
      marginRight: 20
    }
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
    firstMessage: {
      marginLeft: 20
    }
  }),
  content: {
      padding: 16,
      paddingTop: 0,
      paddingBottom: 0
  },
  avatarContainer: {
      padding: 16,
      paddingBottom: 0,
      flexDirection: 'row',
      marginBottom: 10,
      justifyContent: 'space-between'
  },

  nameContainer: {
      marginLeft: 10,
  },

  name: {
      fontSize: 14,
      color: 'black',
      fontWeight: '600'
  },

  time: {
      color: 'gray',
      fontSize: 12,
  },

  profile: {
      height: 20,
      width: 20,
      borderRadius: 5,

  },
  row: {
    flexDirection: 'row',
    height: 46,
    marginRight: 5,

  },
    likes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
        height: 32,
        paddingTop: 7,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
    },
    imageActive: {
      flex: 1,
      resizeMode: 'contain',
      justifyContent: 'center'
    }
};

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: true,
  inverted: true,
};

Message.propTypes = {
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
