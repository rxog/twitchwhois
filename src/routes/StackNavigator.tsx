/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SearchPage from '@/pages/Search';
import TwitchUserPage from '@/pages/TwitchUser';
//import {RouteParams} from '@/utils/types/RouteParams';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrendingPage from '@/pages/Trending';
import {View} from 'react-native';
import Header from '@/components/Header';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        header: props => {
          return (
            <View style={{height: 64}}>
              <Header title={props.options.title} />
            </View>
          );
        },
      }}>
      <Stack.Screen component={SearchPage} name="index" />
      <Stack.Screen
        component={TwitchUserPage}
        name="twitchuser"
        options={{
          statusBarHidden: true,
        }}
      />
      <Stack.Screen
        component={TrendingPage}
        name="trending"
        options={{title: 'Trending', headerShown: true, statusBarHidden: true}}
      />
    </Stack.Navigator>
  );
}
