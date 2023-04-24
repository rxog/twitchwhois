import {configureStore} from '@reduxjs/toolkit';
import {rememberReducer, rememberEnhancer} from 'redux-remember';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingsReducer} from './Settings';
import {MonitorReducer} from './Monitor';

const reducers = {
  settings: SettingsReducer,
  monitor: MonitorReducer,
};

const reducer = rememberReducer(reducers);

export const Store = configureStore({
  reducer,
  enhancers: [
    rememberEnhancer(AsyncStorage, Object.keys(reducers), {
      persistWholeStore: true,
    }),
  ],
});

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;
