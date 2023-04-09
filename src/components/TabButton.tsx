import React, {useRef, useMemo} from 'react';
import {Animated, Pressable} from 'react-native';
import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';

export default function TabButton(props: BottomTabBarButtonProps) {
  const focused = !!props.accessibilityState?.selected;
  const value = (focus: boolean) => (focus ? 0 : 1);
  const animateValue = useRef(new Animated.Value(value(focused))).current;
  const AnimatedComponent = Animated.createAnimatedComponent(Pressable);

  useMemo(() => {
    Animated.timing(animateValue, {
      toValue: value(!focused),
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [focused, animateValue]);

  return (
    <AnimatedComponent
      {...props}
      style={[
        props.style,
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
      ]}
    />
  );
}
