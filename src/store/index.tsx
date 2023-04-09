import {configureStore} from '@reduxjs/toolkit';
import {rememberReducer, rememberEnhancer} from 'redux-remember';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsReducer from './reducers/settings';
import resultsReducer from './reducers/results';

const reducers = {
  settings: settingsReducer,
  results: resultsReducer,
};

const reducer = rememberReducer(reducers);

export const store = configureStore({
  reducer,
  enhancers: [
    rememberEnhancer(AsyncStorage, Object.keys(reducers), {
      persistWholeStore: true,
    }),
  ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
