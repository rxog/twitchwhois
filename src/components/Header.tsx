import React, {createContext, useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme, TouchableRipple} from 'react-native-paper';
import Fonts from '@/pages/Styles/Fonts';
import Icon from './Icon';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

export type HeaderContextProps = {
  title: string;
  setTitle: (title: string) => void;
};
export const HeaderContext = createContext<HeaderContextProps>({
  title: '',
  setTitle: () => {},
});
export const useHeaderContext = () => useContext(HeaderContext);

export default function Header(
  props: NativeStackHeaderProps | BottomTabHeaderProps,
) {
  const route = props.route;
  const options = props.options;
  const navigation = props.navigation;
  const [title, setTitle] = useState(options?.title || route?.name);
  const [scrollOffset, setScrollOffset] = useState({x: 0, y: 0});
  const defaultContextValue = {title, setTitle, scrollOffset, setScrollOffset};

  const {colors} = useTheme();
  const style = StyleSheet.create({
    container: {
      marginBottom: 50,
    },
    content: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      flexDirection: 'row',
      position: 'absolute',
      padding: 10,
    },
    title: {
      fontFamily: Fonts.TwitchyTV.fontFamily,
      lineHeight: 28,
      textAlign: 'center',
      color: colors.onPrimaryContainer,
    },
    view: {
      flex: 1,
      paddingHorizontal: 35,
    },
    buttonView: {
      backgroundColor: colors.backdrop,
      borderRadius: 50,
      overflow: 'hidden',
      position: 'absolute',
    },
    backView: {
      left: 5,
    },
    searchView: {
      right: 5,
    },
    button: {
      padding: 10,
    },
  });

  return (
    <HeaderContext.Provider value={defaultContextValue}>
      <View style={style.container}>
        <View style={style.content}>
          <View style={style.view}>
            <Text variant="headlineSmall" numberOfLines={1} style={style.title}>
              {title}
            </Text>
          </View>
          {navigation?.canGoBack() && (
            <View style={[style.buttonView, style.backView]}>
              <TouchableRipple
                style={style.button}
                onPress={() => {
                  navigation?.goBack();
                }}>
                <Text>
                  <Icon from="materialIcons" name="arrow-back" size={20} />
                </Text>
              </TouchableRipple>
            </View>
          )}
        </View>
      </View>
    </HeaderContext.Provider>
  );
}
