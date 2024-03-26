import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../../common/Color';

const MenuButton = props => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={{ flex: 1 }}>
        <Card {...props} style={{ ...styles.appCard, ...props.style }}>
          <Ionicons style={styles.buttonIcon} name={props.iconName} size={25} />
        </Card>
        <View style={{...styles.textContainer, ...props.style}}>
          <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
            {props.title}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  appCard: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonIcon: {
    marginBottom: 15,
    color: Color.primaryBackgroundColor.backgroundColor,
    paddingTop: 19,
  },
  textContainer: {
    maxWidth: 60, // Sesuaikan dengan lebar card
  },
});

export default MenuButton;
