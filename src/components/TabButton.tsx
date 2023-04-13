/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useMemo} from 'react';
import {Animated} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';

export default function TabButton(props: BottomTabBarButtonProps) {
  const focused = !!props.accessibilityState?.selected;
  const value = (focus: boolean) => (focus ? 0 : 1);
  const animateValue = useRef(new Animated.Value(value(focused))).current;

  useMemo(() => {
    Animated.timing(animateValue, {
      toValue: value(!focused),
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [focused, animateValue]);

  const {children, style, ...rest} = props;

  return (
    <TouchableRipple {...rest} style={[style, {overflow: 'hidden'}]}>
      <Animated.View
        style={[
          style,
          {
            transform: [
              {
                scale: animateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableRipple>
  );
}
