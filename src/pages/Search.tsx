/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Pressable, ScrollView, View} from 'react-native';
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
      <View style={{marginBottom: 20, flexDirection: 'row'}}>
        <View>
          <Text
            style={[
              fonts.headlineLarge,
              {
                fontFamily: Fonts.TwitchyTV.fontFamily,
                color: colors.onSurfaceVariant,
              },
            ]}>
            Twitch
          </Text>
        </View>
        <View
          style={{
            transform: [
              {
                rotate: '-10deg',
              },
              {
                translateY: -2,
              },
            ],
          }}>
          <Text
            style={[
              fonts.headlineLarge,
              {
                color: colors.secondary,
                fontFamily: Fonts.TalkComic.fontFamily,
              },
            ]}>
            Who
          </Text>
        </View>
        <View
          style={{
            transform: [
              {
                rotate: '10deg',
              },
            ],
          }}>
          <Text
            style={[
              fonts.headlineLarge,
              {
                fontFamily: Fonts.TwitchyTV.fontFamily,
                color: colors.onSurfaceVariant,
              },
            ]}>
            Is
          </Text>
        </View>
      </View>
      <Searchbar
        onSubmit={query => {
          navigation.navigate('twitchuser', {
            username: query,
          });
        }}
      />
      <View style={{marginVertical: 20}}>
        <Pressable
          onPress={() => {
            navigation.navigate('topgames');
          }}>
          <Text
            style={{
              textDecorationLine: 'underline',
            }}>
            Trending games (Top 10)
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
