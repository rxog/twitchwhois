/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  AppRegistry,
  DeviceEventEmitter,
  PermissionsAndroid,
} from 'react-native';
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
    const bootListener = DeviceEventEmitter.addListener('BOOT_COMPLETED', () =>
      checkStatus(),
    );

    return () => bootListener.remove();
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
