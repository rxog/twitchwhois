import React from 'react';
import {View, Text, TextStyle} from 'react-native';

export default function ProfileItem({
  title,
  description,
  titleStyle,
  descriptionStyle,
}: {
  title: string;
  description?: (() => JSX.Element) | string;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}) {
  console.log(description, typeof description);
  return (
    <View>
      <Text style={titleStyle}>{title}</Text>
      {typeof description === 'string' ? (
        <Text style={descriptionStyle}>{description}</Text>
      ) : (
        description?.()
      )}
    </View>
  );
}
