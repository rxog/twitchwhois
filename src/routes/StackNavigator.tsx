import React from 'react';
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
        options={({route}) => {
          const params: RouteParams = route.params as RouteParams;
          return {
            title: params?.username,
            headerShown: true,
          };
        }}
      />
    </Stack.Navigator>
  );
}
