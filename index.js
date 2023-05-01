import React, {Component} from 'react';
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
    const items = Store.getState().monitor.filter(o => o.isMonitoring);

    await Promise.all(
      items.map(item =>
        TwitchAPI.isAvailable(item.userName).then(async status => {
          const updated = {...item, lastCheckedAt: new Date().toISOString()};

          if (status === 1) {
            dispatch(
              MonitorActions.update({
                ...updated,
                isAvailable: true,
              }),
            );
            displayNotification(item.userName);
          } else {
            dispatch(MonitorActions.update(updated));
          }

          await sleep(1000);

          return status;
        }),
      ),
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default class Main extends Component {
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
        await fetchMonitorList().then(updated =>
          console.log(updated, new Date()),
        );
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
  await fetchMonitorList().then(updated => console.log(updated, new Date()));
  BackgroundFetch.finish(taskId);
});
