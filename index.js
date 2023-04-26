import React from 'react';
import {AppRegistry} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {Store} from '@/store';
import {MonitorActions} from '@/store/Monitor';
import App from './src/App';
import TwitchAPI from '@/utils/Twitch';
import sleep from '@/utils/sleep';
import displayNotification from '@/utils/DisplayNotification';

const fetchMonitorList = async () => {
  try {
    const dispatch = Store.dispatch;
    const items = Store.getState().monitor;

    for (const item of items.filter(o => o.isMonitoring)) {
      const now = new Date().toISOString();

      await TwitchAPI.isAvailable(item.userName).then(async status => {
        if (status === 1) {
          dispatch(
            MonitorActions.update({
              ...item,
              lastCheckedAt: now,
              isAvailable: true,
            }),
          );
          displayNotification(item.userName);
        } else {
          dispatch(
            MonitorActions.update({
              ...item,
              lastCheckedAt: now,
            }),
          );
        }

        await sleep(5000);
      });
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default class Main extends React.PureComponent {
  componentDidMount() {
    this.initBackgroundFetch();
  }

  async initBackgroundFetch() {
    BackgroundFetch.configure(
      {
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      },
      async taskId => {
        await fetchMonitorList().then(console.log);
        BackgroundFetch.finish(taskId);
      },
      taskId => {
        console.log('Background TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
      },
    ).then(console.log);

    BackgroundFetch.scheduleTask({
      taskId: 'update-monitor-items',
      delay: 1000 * 60,
      periodic: true,
      requiresNetworkConnectivity: true,
    });
  }

  render() {
    return (
      <Provider store={Store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => Main);

BackgroundFetch.registerHeadlessTask(async ({timeout, taskId}) => {
  if (timeout) {
    console.log('Headless TIMEOUT:', taskId);
    BackgroundFetch.finish(taskId);
    return;
  }
  await fetchMonitorList().then(console.log);
  BackgroundFetch.finish(taskId);
});
