import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Colors, Headline} from 'react-native-paper';

const SplashScreen = () => {
  return (
      <View style={styles.spinner}>
        <ActivityIndicator
        animating={true}
        size={40}
        />
    </View>
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

export default SplashScreen;
