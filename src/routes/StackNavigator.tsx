/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import SearchPage from '@/pages/Search';
import TrendingPage from '@/pages/Trending';
import TwitchUserPage from '@/pages/TwitchUser';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from '@/components/Header';
import {RouteParams} from '@/utils/types/RouteParams';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        header: props => {
          return <Header {...props} />;
        },
      }}>
      <Stack.Screen component={SearchPage} name="index" />
      <Stack.Screen
        component={TrendingPage}
        name="trending"
        options={{headerShown: true}}
      />
      <Stack.Screen
        component={TwitchUserPage}
        name="twitchuser"
        options={({route}) => {
          const params = route.params as RouteParams;
          return {
            title: `@/${params.username}`,
            headerShown: true,
          };
        }}
      />
    </Stack.Navigator>
  );
}
