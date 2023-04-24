import React, {PropsWithChildren} from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {colors, colorObject, colorAlpha} from '@/assets/styles';

type ButtonProps = PropsWithChildren<{
  color?: ColorValue;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  disabled?: boolean;
  elevation?: number;
  icon?: (args: any) => React.ReactNode;
  onLongPress?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  radius?: number;
  style?: ViewStyle;
  textColor?: ColorValue;
  textSize?: number;
}>;

export default function Button({
  children,
  color = colors.background,
  direction = 'row',
  disabled = false,
  elevation = 5,
  icon,
  onLongPress,
  onPress,
  radius = 8,
  style,
  textColor = colors.text,
  textSize = 16,
}: ButtonProps) {
  const [pressed, setPressed] = React.useState(false);
  const renderIcon = React.useMemo(
    () => icon && icon({pressed, color: textColor, size: textSize}),
    [icon, pressed, textColor, textSize],
  );
  const colorObj = colorObject(color);
  const colorIsDark = colorObj.isDark();
  const textColorObj = colorObject(textColor);
  const textColorIsDark = textColorObj.isDark();
  const gap = Number(style?.paddingVertical || 8);

  const styles = StyleSheet.create({
    main: {
      alignSelf: 'flex-start',
      backgroundColor: disabled ? colors.muted : color,
      borderRadius: radius,
      elevation: elevation,
      overflow: 'hidden',
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    content: {
      gap,
      alignItems: 'center',
      flexDirection: direction,
    },
    text: {
      color:
        textColorIsDark && colorIsDark
          ? colors.light
          : !textColorIsDark && !colorIsDark
          ? colors.dark
          : textColor,
      fontSize: textSize,
    },
  });

  return (
    <View style={[styles.main, style]}>
      <View style={styles.content}>
        {renderIcon}
        <Text style={styles.text}>{children}</Text>
      </View>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={StyleSheet.absoluteFill}
        android_ripple={{
          color: colorAlpha(colorIsDark ? colors.light : colors.dark, 0.1),
        }}
      />
    </View>
  );
}
