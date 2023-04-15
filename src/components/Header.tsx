import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme, TouchableRipple} from 'react-native-paper';
import Fonts from '@/pages/Styles/Fonts';
import Icon from './Icon';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

export default function Header(
  props: NativeStackHeaderProps | BottomTabHeaderProps,
) {
  const route = props.route;
  const options = props.options;
  const navigation = props.navigation;

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
      textAlign: 'center',
      fontFamily: Fonts.TwitchyTV.fontFamily,
      lineHeight: 28,
      color: colors.onPrimaryContainer,
    },
    view: {
      flex: 1,
      paddingHorizontal: 35,
    },
    backView: {
      borderRadius: 50,
      overflow: 'hidden',
      position: 'absolute',
      left: 5,
    },
    backButton: {
      padding: 10,
    },
  });

  return (
    <View style={style.container}>
      <View style={style.content}>
        <View style={style.view}>
          <Text variant="headlineSmall" numberOfLines={1} style={style.title}>
            {options?.title || route?.name}
          </Text>
        </View>
        {navigation?.canGoBack() && (
          <View style={style.backView}>
            <TouchableRipple
              style={style.backButton}
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
  );
}
