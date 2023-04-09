/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNavigator from './StackNavigator';
import SettingsPage from '@/pages/Settings';
import HistoryPage from '@/pages/History';
import FAQPage from '@/pages/FAQ';
import {Text} from 'react-native-paper';
import Icon from '@/components/Icon';
import TabButton from '@/components/TabButton';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      backBehavior="order"
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
        tabBarLabel: ({focused, color, children}) => {
          return (
            !focused && <Text style={{color, fontSize: 10}}>{children}</Text>
          );
        },
        tabBarButton: props => {
          return <TabButton {...props} />;
        },
      }}>
      <Tab.Screen
        name="search"
        component={StackNavigator}
        options={{
          title: 'Busca',
          headerShown: false,
          tabBarIcon: props => (
            <Icon from="materialIcons" name="search" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsPage}
        options={{
          title: 'Definições',
          tabBarIcon: props => (
            <Icon from="materialCommunity" name="cog" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={HistoryPage}
        options={{
          title: 'Monitoramento',
          tabBarIcon: props => (
            <Icon from="foundation" name="results" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="faq"
        component={FAQPage}
        options={{
          title: 'Sobre',
          tabBarIcon: props => (
            <Icon from="materialCommunity" name="card-bulleted" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
