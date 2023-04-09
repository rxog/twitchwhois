/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SearchBox from '@/components/SearchBox';
import {Text, useTheme} from 'react-native-paper';
import Fonts from './Styles/Fonts';

export default function SearchPage({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}): JSX.Element {
  const {colors, fonts} = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{marginBottom: 20}}>
        <Text
          style={[
            fonts.headlineLarge,
            {
              fontFamily: Fonts.TwitchyTV.fontFamily,
              color: colors.onSurfaceVariant,
            },
          ]}>
          Twitch
          <Text
            style={{
              color: colors.onSecondaryContainer,
              fontFamily: Fonts.TalkComic.fontFamily,
            }}>
            Who
          </Text>
          Is
        </Text>
      </View>
      <SearchBox
        onSubmit={query => {
          navigation.navigate('twitchuser', {
            username: query,
          });
        }}
      />
    </ScrollView>
  );
}
