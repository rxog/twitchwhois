import BackgroundTask from './BackgroundTask';
import isBefore from 'date-fns/isBefore';
import addMinutes from 'date-fns/addMinutes';
import {store} from '@/store';
import {actions} from '@/store/reducers/results';
import TwitchAPI from '@/utils/TwitchAPI';
import Sleep from '@/utils/Sleep';

export default function RunBackgroundTask() {
  BackgroundTask.run(async ({signal}: {signal: AbortSignal}) => {
    try {
      const dispatch = store.dispatch;
      const {results, settings} = store.getState();

      for (const {username, nextCheck} of results.filter(
        result => result.running,
      )) {
        const now = new Date();
        const next = nextCheck ? Date.parse(nextCheck) : now;
        const timeouted = isBefore(next, now);

        if (timeouted) {
          console.log('Timeouted!');
          await TwitchAPI.isAvailable(username, signal).then(async status => {
            if (status) {
              dispatch(
                actions.saveResult({
                  username,
                  running: false,
                  status,
                }),
              );
            } else {
              dispatch(
                actions.saveResult({
                  username,
                  lastCheck: now.toISOString(),
                  nextCheck: addMinutes(now, settings.interval).toISOString(),
                  status,
                }),
              );
            }
          });
        }
        await Sleep(1000);
      }
    } catch (err) {
      console.log(err);
    }
    await Sleep(1000);
  });
}
