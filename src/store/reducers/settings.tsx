import {Appearance} from 'react-native';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SettingsState {
  dark: boolean;
  interval: number;
}

const initialState: SettingsState = {
  dark: Appearance.getColorScheme() === 'dark',
  interval: 5,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: state => {
      state.dark = !state.dark;
    },
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload;
    },
    reset: () => initialState,
  },
});

export const actions = settingsSlice.actions;
export default settingsSlice.reducer;
