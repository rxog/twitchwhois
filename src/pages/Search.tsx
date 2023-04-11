/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Searchbar from '@/components/Searchbar';
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
          <View
            style={{
              transform: [
                {
                  rotate: '-10deg',
                },
                {
                  translateY: 6,
                },
              ],
            }}>
            <Text
              style={[
                fonts.headlineLarge,
                {
                  color: colors.onSecondaryContainer,
                  fontFamily: Fonts.TalkComic.fontFamily,
                },
              ]}>
              Who
            </Text>
          </View>
          Is
        </Text>
      </View>
      <Searchbar
        onSubmit={query => {
          navigation.navigate('twitchuser', {
            username: query,
          });
        }}
      />
    </ScrollView>
  );
}
