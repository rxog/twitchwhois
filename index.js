import React from 'react';
import {AppRegistry, PermissionsAndroid} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {Store} from '@/store';
import App from './src/App';

export default function Main() {
  PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  ).then(ok => {
    if (ok) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  });

  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
