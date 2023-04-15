import React from 'react';
import TabNavigator from './TabNavigator';
import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export default function Navigation(): JSX.Element {
  return <TabNavigator />;
}
