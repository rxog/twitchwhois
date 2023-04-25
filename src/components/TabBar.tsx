/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Pressable, Text, Keyboard, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {colorAlpha, colorObject, colors} from '@/assets/styles';
import {NavigationState} from '@react-navigation/native';

type TabBarProps = {
  state: NavigationState;
  descriptors: any;
  navigation: any;
};

export default function TabBar({state, descriptors, navigation}: TabBarProps) {
  const currentRoute = descriptors[state.routes[state.index].key];
  const currentOptions = currentRoute.options;
  const tabBarBackground = currentOptions.tabBarBackground;
  const tabBarHideOnKeyboard = !!currentOptions?.tabBarHideOnKeyboard;
  const [tabHeight, setTabHeight] = useState(0);
  const translateY = useSharedValue(0);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (tabBarHideOnKeyboard) {
        translateY.value = withSpring(tabHeight);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      if (tabBarHideOnKeyboard) {
        translateY.value = withSpring(0);
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [tabBarHideOnKeyboard, tabHeight, translateY]);

  const styles = StyleSheet.create({
    main: {
      marginTop: 20,
      zIndex: 9999,
      bottom: 20,
      right: 0,
      left: 0,
      alignItems: 'center',
      position: 'absolute',
    },
    tabBar: {
      overflow: 'hidden',
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: colorAlpha(colors.backgroundVariant, 0.8),
      borderRadius: 50,
      elevation: 5,
      padding: 10,
      gap: 10,
    },
    tabButtonView: {
      borderRadius: 100,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
    },
  });

  return (
    <View>
      <Animated.View
        onLayout={({nativeEvent}) =>
          setTabHeight(nativeEvent.layout.height * 2)
        }
        style={[styles.main, translateStyle]}>
        {tabBarBackground && tabBarBackground}
        <View style={styles.tabBar}>
          {state.routes.map((route, index: number) => {
            const {options} = descriptors[route.key];

            const focused = state.index === index;
            const color = focused
              ? options?.tabBarActiveTintColor
              : options?.tabBarInactiveTintColor;
            const backgroundColor = focused
              ? options?.tabBarActiveBackgroundColor
              : options?.tabBarInactiveBackgroundColor;

            const button = options.tabBarButton;

            const icon =
              options.tabBarIcon &&
              options.tabBarIcon({
                focused,
                color,
                size: 28,
              });

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const badge = options.tabBarBadge;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            if (button) {
              return button?.();
            }

            return (
              <View key={route.key}>
                <View style={[styles.tabButtonView, {backgroundColor}]}>
                  {icon ? icon : <Text style={{color}}>{label}</Text>}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={StyleSheet.absoluteFill}
                    android_ripple={{
                      color: colorAlpha(
                        colorObject(backgroundColor).isDark()
                          ? colors.light
                          : colors.dark,
                        0.1,
                      ),
                    }}
                  />
                </View>
                {badge && (
                  <View
                    style={{
                      backgroundColor: colors.errorContainer,
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 20,
                      width: 20,
                    }}>
                    <Text style={{color: colors.onErrorContainer}}>
                      {badge}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}
