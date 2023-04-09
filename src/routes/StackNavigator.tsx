/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import SearchBox from '@/components/SearchBox';
import SearchPage from '@/pages/Search';
import TwitchUserPage from '@/pages/TwitchUser';
import {RouteParams} from '@/utils/types/RouteParams';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen component={SearchPage} name="index" />
      <Stack.Screen
        component={TwitchUserPage}
        name="twitchuser"
        options={({navigation, route}) => {
          const params: RouteParams = route.params as RouteParams;
          return {
            title: params?.username,
            headerTitle: () => (
              <SearchBox
                style={{
                  marginLeft: -16,
                }}
                value={params?.username}
                onSubmit={query => {
                  navigation.replace('twitchuser', {username: query});
                }}
              />
            ),
            headerShown: true,
          };
        }}
      />
    </Stack.Navigator>
  );
}
