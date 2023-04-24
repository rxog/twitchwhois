import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Monitor from '@/pages/Monitor';
import SettingsPage from '@/pages/Settings';
import screenOptions from '../ScreenOptions';

const Stack = createNativeStackNavigator();

const MonitorStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="List" component={Monitor} />
    <Stack.Screen name="Settings" component={SettingsPage} />
  </Stack.Navigator>
);

export default MonitorStack;
