import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';

const LoadingOverlay = () => {
  return (
    <ActivityIndicator
      style={styles.spinner}
      animating={true}
      size={40}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '50%',
    zIndex: 99,
  },
});

export default LoadingOverlay;
