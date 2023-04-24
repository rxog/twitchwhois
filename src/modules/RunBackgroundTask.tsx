import BackgroundTask from './BackgroundTask';
import {Store} from '@/store';
import {MonitorActions} from '@/store/Monitor';
import displayNotification from '@/modules/DisplayNotification';
import {isPast, addMinutes} from 'date-fns';
import TwitchAPI from '@/utils/Twitch';
import sleep from '@/utils/sleep';

export default function RunBackgroundTask() {
  const runningTasks = Store.getState().monitor.filter(
    task => task.isMonitoring,
  ).length;

  if (runningTasks && BackgroundTask.isRunning) {
    return;
  }
  if (!runningTasks && BackgroundTask.isRunning) {
    return BackgroundTask.stop();
  }
  if (!runningTasks && !BackgroundTask.isRunning) {
    return;
  }

  BackgroundTask.run(async ({signal}: {signal: AbortSignal}) => {
    try {
      const dispatch = Store.dispatch;
      const {monitor, settings} = Store.getState();

      for (const {userName, nextCheckAt} of monitor.filter(
        result => result.isMonitoring,
      )) {
        const now = new Date();
        const next = nextCheckAt ? Date.parse(nextCheckAt) : 0;

        if (isPast(next)) {
          await TwitchAPI.isAvailable(userName, signal).then(async status => {
            if (status === 1) {
              displayNotification(userName);
              dispatch(
                MonitorActions.update({
                  userName,
                  lastCheckedAt: now.toISOString(),
                  nextCheckAt: addMinutes(
                    now,
                    settings.interval * 10,
                  ).toISOString(),
                  isAvailable: true,
                }),
              );
            } else {
              dispatch(
                MonitorActions.update({
                  userName,
                  lastCheckedAt: now.toISOString(),
                  nextCheckAt: addMinutes(now, settings.interval).toISOString(),
                  isAvailable: false,
                }),
              );
            }
          });
        }
        await sleep(1000);
      }
    } catch (err) {
      console.log(err);
    }
    await sleep(15000);
  });
}
