import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Trending from '@/pages/Trending';
import screenOptions from '../ScreenOptions';

const Stack = createNativeStackNavigator();

const TrendingStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Top10" component={Trending} />
  </Stack.Navigator>
);

export default TrendingStack;
