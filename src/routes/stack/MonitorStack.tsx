import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Monitor from '@/pages/Monitor';
import screenOptions from '../ScreenOptions';

const Stack = createNativeStackNavigator();

const MonitorStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="List" component={Monitor} />
  </Stack.Navigator>
);

export default MonitorStack;
