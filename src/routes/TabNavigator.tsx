/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNavigator from './StackNavigator';
import SettingsPage from '@/pages/Settings';
import MonitorPage from '@/pages/Monitor';
import AboutPage from '@/pages/About';
import {Text} from 'react-native-paper';
import Icon from '@/components/Icon';
import TabButton from '@/components/TabButton';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const tasks = useSelector((state: RootState) => state.results)?.length;
  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={tasks > 0 ? 'monitor' : 'search'}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabel: ({focused, color, children}) => {
          return (
            !focused && <Text style={{color, fontSize: 10}}>{children}</Text>
          );
        },
        tabBarButton: props => {
          return <TabButton {...props} />;
        },
        tabBarBadgeStyle: {
          position: 'absolute',
          top: 6,
          left: 12,
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
        name="monitor"
        component={MonitorPage}
        options={{
          title: 'Monitoramento',
          tabBarIcon: props => (
            <Icon from="materialCommunity" name="list-status" {...props} />
          ),
          tabBarBadge: tasks > 0 ? tasks : undefined,
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
        name="about"
        component={AboutPage}
        options={{
          title: 'Sobre',
          tabBarIcon: props => (
            <Icon
              from="materialCommunity"
              name="exclamation-thick"
              {...props}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
