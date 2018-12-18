/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, View, ViewPropTypes } from 'react-native';
import Lightbox from 'react-native-lightbox';

export default function MessageImage({
  containerStyle,
  lightboxProps,
  imageProps,
  imageStyle,
  currentMessage,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{
          style: styles.imageActive,
        }}
        {...lightboxProps}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{ uri: currentMessage.image }}
        />
      </Lightbox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
    justifyContent: 'center'
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center'
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
};
