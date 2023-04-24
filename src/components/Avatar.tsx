import React from 'react';
import {ColorValue, Image, View, StyleSheet} from 'react-native';

type AvatarProps = {
  borderColor: ColorValue;
  borderWidth: number;
  source: string;
  size: number;
};

export default function Avatar({
  source,
  size,
  borderColor,
  borderWidth,
}: AvatarProps) {
  const styles = StyleSheet.create({
    view: {
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderRadius: 100,
      overflow: 'hidden',
    },
    image: {
      backgroundColor: borderColor,
      height: size,
      width: size,
    },
  });
  return (
    <View style={styles.view}>
      <Image
        source={{
          uri: source,
        }}
        style={styles.image}
      />
    </View>
  );
}
