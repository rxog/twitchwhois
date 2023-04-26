/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ColorValue, Pressable, Image, View} from 'react-native';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
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
  borderWidth = 0,
}: AvatarProps) {
  const borderRadius = useSharedValue(100);
  const AnimBorderWidth = useSharedValue(borderWidth);

  const imageViewStyle = useAnimatedStyle(() => ({
    borderColor: borderColor,
    borderWidth: AnimBorderWidth.value,
    borderRadius: borderRadius.value,
    overflow: 'hidden',
  }));

  return (
    <View>
      <Animated.View style={imageViewStyle}>
        <Pressable
          onPressIn={() => {
            borderRadius.value = withSpring(14);
          }}
          onPressOut={() => {
            borderRadius.value = withSpring(100);
          }}>
          <Image
            source={{
              uri: source,
            }}
            style={{
              width: size,
              height: size,
              resizeMode: 'contain',
              backgroundColor: borderColor,
            }}
          />
        </Pressable>
      </Animated.View>
      {isLive && (
        <PulseIndicator
          color="#f04545"
          style={{position: 'absolute', top: -10, right: -10}}
        />
      )}
    </View>
  );
}
