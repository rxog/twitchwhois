/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import Icon from '@/components/Icon';
import HomeStack from './stack/HomeStack';
import TrendingStack from './stack/TrendingStack';
import MonitorStack from './stack/MonitorStack';
import screenOptions from './ScreenOptions';
import TabBar from '@/components/TabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const tasks = useSelector((state: RootState) => state.monitor)?.length;
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: props => (
            <Icon from="materialIcons" name="search" {...props} />
          ),
        }}
      />
      <Tab.Screen
        name="Monitor"
        component={MonitorStack}
        options={{
          tabBarIcon: props => (
            <Icon from="materialCommunity" name="list-status" {...props} />
          ),
          tabBarBadge: tasks > 0 ? tasks : undefined,
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingStack}
        options={{
          tabBarIcon: props => (
            <Icon from="ionicons" name="trending-up" {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
