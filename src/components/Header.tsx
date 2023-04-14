import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme, TouchableRipple} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Fonts from '@/pages/Styles/Fonts';
import Icon from './Icon';

type HeaderProps = {
  title?: string;
};

export default function Header({title}: HeaderProps) {
  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation<NavigationProp<any>>();

  const {colors} = useTheme();
  const style = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: colors.primaryContainer,
      padding: 5,
      height: 64,
    },
    title: {
      textAlign: 'center',
      fontFamily: Fonts.TwitchyTV.fontFamily,
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
      <View style={style.view}>
        <Text variant="headlineSmall" style={style.title}>
          {title || route.name}
        </Text>
      </View>
      <View style={style.backView}>
        <TouchableRipple
          style={style.backButton}
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }}>
          <Text>
            <Icon from="materialIcons" name="arrow-back" size={20} />
          </Text>
        </TouchableRipple>
      </View>
    </View>
  );
}
