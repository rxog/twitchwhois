/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Searchbar from '@/components/Searchbar';
import {Button, Text, useTheme} from 'react-native-paper';
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
                color: colors.primary,
              },
              {
                textShadowColor: colors.shadow,
                textShadowRadius: 2,
                textShadowOffset: {height: 1, width: 1},
              },
            ]}>
            Twitch
          </Text>
        </View>
        <View
          style={{
            zIndex: 999,
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
                marginTop: 5,
                marginLeft: -10,
                marginRight: -5,
                color: colors.primary,
                fontFamily: Fonts.TalkComic.fontFamily,
              },
              {
                textShadowColor: colors.shadow,
                textShadowRadius: 2,
                textShadowOffset: {height: 1, width: 1},
              },
            ]}>
            Who
          </Text>
        </View>
        <View>
          <Text
            style={[
              fonts.headlineLarge,
              {
                fontFamily: Fonts.TwitchyTV.fontFamily,
                color: colors.primary,
              },
              {
                textShadowColor: colors.shadow,
                textShadowRadius: 2,
                textShadowOffset: {height: 1, width: 1},
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
        <Button
          mode="elevated"
          onPress={() => {
            navigation.navigate('trending');
          }}>
          Trending
        </Button>
      </View>
    </ScrollView>
  );
}
