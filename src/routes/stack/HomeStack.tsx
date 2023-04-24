import React from 'react';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import screenOptions from '../ScreenOptions';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Search" component={Search} />
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

export default HomeStack;
