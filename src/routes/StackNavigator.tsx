import React from 'react';
import SearchPage from '@/pages/Search';
import TrendingPage from '@/pages/Trending';
import TwitchUserPage from '@/pages/TwitchUser';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen component={SearchPage} name="index" />
      <Stack.Screen component={TrendingPage} name="trending" />
      <Stack.Screen component={TwitchUserPage} name="twitchuser" />
    </Stack.Navigator>
  );
}
