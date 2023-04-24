import React, {PropsWithChildren} from 'react';
import {Text, TextStyle, StyleSheet} from 'react-native';
import {colors, fonts} from '@/assets/styles';

type HeadlineProps = PropsWithChildren<{
  style?: TextStyle;
}>;

const Headline = ({children, style}: HeadlineProps) => {
  const styles = StyleSheet.create({
    headline: {
      color: colors.secondary,
      fontSize: 24,
      lineHeight: 28,
    },
  });
  return (
    <Text style={[fonts.TwitchyTV, styles.headline, style]}>{children}</Text>
  );
};

export default Headline;
