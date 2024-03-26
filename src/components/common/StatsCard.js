import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, Headline, Subheading, Card} from 'react-native-paper';

const StatsCard = (props) => {
  let textColor = props.textMode === 'light' ? 'white' : 'black';
  return (
    <Card {...props} style={{...styles.statsCard, ...props.style}}>
      <Text
        adjustFontSizeToFit
        style={{...styles.statsCardTitle, ...{color: textColor}}}>
        {props.title}
      </Text>
      <Headline style={{...styles.statsCardValue, ...{color: textColor}}}>
        {props.value}
      </Headline>
      {props.subtitle && (
        <Subheading style={{...styles.statsCardSubtitle, ...{color: textColor}}}>
          {props.subtitle}
        </Subheading>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    padding: '2%',
    paddingLeft: '1.5%',
    width: '50%',
  },
  statsCardTitle: {
    fontSize: 14,
  },
  statsCardValue: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  statsCardSubtitle: {
    fontSize: 12,
  },
});

export default StatsCard;
