/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ColorValue, Image, View, StyleSheet} from 'react-native';
import {PulseIndicator} from 'react-native-indicators';

type AvatarProps = {
  isLive?: boolean;
  borderColor?: ColorValue;
  borderWidth?: number;
  source: string;
  size: number;
};

export default function Avatar({
  isLive,
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
    <View>
      <View style={styles.view}>
        <Image
          source={{
            uri: source,
          }}
          style={styles.image}
        />
      </View>
      {isLive && (
        <PulseIndicator
          color="#FF0000"
          style={{position: 'absolute', top: 10, right: 0}}
        />
      )}
    </View>
  );
}
