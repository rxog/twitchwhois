/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureResponderEvent, Pressable, ColorValue} from 'react-native';
import {useTheme, Text} from 'react-native-paper';

type ResultBoxProps = {
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  backgroundColor: ColorValue;
  textColor: ColorValue;
  textHeader: string;
  textBody: string;
  textBottom?: string;
};

export default function ResultBox({
  onPress,
  onLongPress,
  backgroundColor,
  textColor,
  textHeader,
  textBody,
  textBottom,
}: ResultBoxProps) {
  const {fonts} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        padding: 20,
      }}>
      <Text
        style={[
          fonts.displayLarge,
          {
            fontWeight: 'bold',
            textAlign: 'center',
            color: textColor,
          },
        ]}>
        {textHeader}
      </Text>
      <Text
        style={[
          fonts.displaySmall,
          {
            textAlign: 'center',
            color: textColor,
          },
        ]}>
        {textBody}
      </Text>
      <Text
        style={[
          fonts.bodySmall,
          {
            textAlign: 'center',
            color: textColor,
          },
        ]}>
        {textBottom}
      </Text>
    </Pressable>
  );
}
