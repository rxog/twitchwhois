/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {AppRegistry, PermissionsAndroid} from 'react-native';
import RunBackgroundTask from '@/modules/RunBackgroundTask';
import BackgroundTask from '@/modules/BackgroundTask';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from '@/store';
import App from './src/App';

export default function Main() {
  const [started, setStarted] = useState(BackgroundTask.isRunning);

  PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  ).then(ok => {
    if (ok) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (!started) {
        RunBackgroundTask();
        setStarted(true);
      }
    };
    checkStatus();
    const timeoutId = setTimeout(() => checkStatus(), 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
