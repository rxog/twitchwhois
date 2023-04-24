import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Settings {
  interval: number;
}

const initialState: Settings = {
  interval: 5,
};

const Settings = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload;
    },
    reset: () => initialState,
  },
});

export const SettingsActions = Settings.actions;
export const SettingsReducer = Settings.reducer;
