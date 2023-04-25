import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface MonitorItem {
  userName: string;
  isAvailable: boolean;
  isMonitoring?: boolean;
  lastCheckedAt?: string;
  nextCheckAt?: string;
}

const initialState: MonitorItem[] = [];

const Monitor = createSlice({
  name: 'Monitor',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<MonitorItem>) => {
      const idx = state.findIndex(
        (item: MonitorItem) => item.userName === action.payload.userName,
      );
      if (idx !== -1) {
        state[idx] = {
          ...state[idx],
          ...action.payload,
        };
      } else {
        state.push(action.payload);
      }
      return state;
    },
    remove: (state, action: PayloadAction<string>) => {
      return state.filter(item => item.userName !== action.payload);
    },
    reset: () => initialState,
  },
});

export const MonitorActions = Monitor.actions;
export const MonitorReducer = Monitor.reducer;
