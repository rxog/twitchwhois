import {ColorValue, StyleSheet} from 'react-native';
import Color from 'color';

export const colorObject = (color: ColorValue) => {
  return Color(color);
};

export const colorHex = (color: ColorValue) => {
  return Color(color).hex();
};

export const colorHexa = (color: ColorValue) => {
  return Color(color).hexa();
};

export const colorAlpha = (color: ColorValue, value: number) => {
  return Color(color).alpha(value).toString();
};

export const colors = {
  primary: 'rgb(213, 186, 255)',
  onPrimary: 'rgb(66, 0, 138)',
  primaryContainer: 'rgb(94, 0, 193)',
  onPrimaryContainer: 'rgb(236, 220, 255)',
  secondary: 'rgb(206, 194, 219)',
  onSecondary: 'rgb(53, 45, 64)',
  secondaryContainer: 'rgb(75, 67, 87)',
  onSecondaryContainer: 'rgb(234, 222, 247)',
  tertiary: 'rgb(241, 183, 195)',
  onTertiary: 'rgb(75, 37, 47)',
  tertiaryContainer: 'rgb(100, 59, 69)',
  onTertiaryContainer: 'rgb(255, 217, 224)',
  error: 'rgb(255, 180, 171)',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 180, 171)',
  success: 'rgb(17, 255, 119)',
  onSuccess: 'rgb(8, 161, 75)',
  background: 'rgb(29, 27, 30)',
  onBackground: 'rgb(230, 225, 230)',
  backgroundVariant: 'rgb(17, 17, 17)',
  surface: 'rgb(29, 27, 30)',
  onSurface: 'rgb(230, 225, 230)',
  surfaceVariant: 'rgb(73, 69, 78)',
  onSurfaceVariant: 'rgb(203, 196, 207)',
  outline: 'rgb(149, 142, 153)',
  outlineVariant: 'rgb(73, 69, 78)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(230, 225, 230)',
  inverseOnSurface: 'rgb(50, 48, 51)',
  inversePrimary: 'rgb(122, 38, 231)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(38, 35, 41)',
    level2: 'rgb(44, 40, 48)',
    level3: 'rgb(49, 45, 55)',
    level4: 'rgb(51, 46, 57)',
    level5: 'rgb(55, 49, 62)',
  },
  surfaceDisabled: 'rgba(230, 225, 230, 0.12)',
  onSurfaceDisabled: 'rgba(230, 225, 230, 0.38)',
  backdrop: 'rgba(51, 47, 55, 0.4)',
  light: 'rgb(248, 248, 248)',
  dark: 'rgb(8, 8, 8)',
  text: 'rgb(230, 225, 230)',
  textVariant: 'rgb(203, 196, 207)',
  muted: 'rgb(145, 145, 145)',
};

export const sizes = {
  headlineLarge: 28,
  headlineMedium: 24,
  headlineSmall: 20,
  bodyLarge: 18,
  bodyMedium: 16,
  bodySmall: 14,
};

export const fonts = StyleSheet.create({
  RobotoBlack: {
    fontFamily: 'Roboto-Black',
  },
  RobotoBlackItalic: {
    fontFamily: 'Roboto-BlackItalic',
  },
  RobotoBold: {
    fontFamily: 'Roboto-Bold',
  },
  RobotoBoldItalic: {
    fontFamily: 'Roboto-BoldItalic',
  },
  RobotoItalic: {
    fontFamily: 'Roboto-Italic',
  },
  RobotoLight: {
    fontFamily: 'Roboto-Light',
  },
  RobotoLightItalic: {
    fontFamily: 'Roboto-LightItalic',
  },
  RobotoMedium: {
    fontFamily: 'Roboto-Medium',
  },
  RobotoMediumItalic: {
    fontFamily: 'Roboto-MediumItalic',
  },
  RobotoRegular: {
    fontFamily: 'Roboto-Regular',
  },
  RobotoThin: {
    fontFamily: 'Roboto-Thin',
  },
  RobotoThinItalic: {
    fontFamily: 'Roboto-ThinItalic',
  },
  Neodigital: {
    fontFamily: 'Neodigital',
  },
  TalkComic: {
    fontFamily: 'TalkComic',
  },
  TwitchyTV: {
    fontFamily: 'TwitchyTV',
  },
  Zullia: {
    fontFamily: 'Zullia',
  },
});
