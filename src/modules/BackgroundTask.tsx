import backgroundServer from 'react-native-background-actions';
import {displayName} from '../../app.json';

type Options = {
  taskName?: string;
  taskTitle?: string;
  taskDesc?: string;
  taskIcon?: {
    type: string;
    name: string;
  };
  linkingURI?: string;
};

const defaultOptions: Options = {
  taskName: 'background-task',
  taskTitle: displayName,
  taskDesc: '',
  taskIcon: {
    type: 'mipmap',
    name: 'ic_launcher_round',
  },
  linkingURI: 'twitchwhois://monitor',
};

export class BackgroundTask {
  public isRunning = false;
  private options: Options;
  private controller: AbortController;

  constructor() {
    this.options = defaultOptions;
    this.controller = new AbortController();
  }

  async run(taskData: (taskData?: any) => Promise<void>) {
    if (this.isRunning) {
      await this.stop();
    }
    if (this.controller.signal.aborted) {
      this.controller = new AbortController();
    }
    this.isRunning = true;

    await backgroundServer.start(
      async (data?: unknown): Promise<void> => {
        while (true) {
          try {
            if (!this.isRunning || this.controller.signal.aborted) {
              break;
            }
            await taskData(data);
          } catch (err) {
            break;
          }
        }
      },
      {
        ...this.options,
        parameters: {signal: this.controller.signal},
      } as any,
    );
  }

  async stop() {
    this.controller.signal.onabort = () =>
      (this.controller = new AbortController());
    this.options = defaultOptions;
    this.isRunning = false;
    this.controller.abort();
    await backgroundServer.stop();
  }

  async notification(options: Options) {
    this.options = {...this.options, ...options};
    return backgroundServer.updateNotification(this.options);
  }
}

export default new BackgroundTask();
