import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ResultsState {
  username: string;
  lastCheck?: string;
  nextCheck?: string;
  running?: boolean;
  status: number;
}

const initialState: ResultsState[] = [];

export const dataSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    saveResult: (state, action: PayloadAction<ResultsState>) => {
      const {username} = action.payload;
      const updatedResults = [...state];
      const indexToUpdate = updatedResults.findIndex(
        (result: ResultsState) => result.username === username,
      );
      if (indexToUpdate !== -1) {
        updatedResults[indexToUpdate] = {
          ...updatedResults[indexToUpdate],
          ...action.payload,
        };
        return updatedResults;
      } else {
        const result = action.payload;
        state.push(result);
      }
    },
    removeResult: (state, action: PayloadAction<string>) => {
      const username = action.payload;
      const updatedResults = state.filter(
        result => result.username !== username,
      );
      return updatedResults;
    },
    reset: () => initialState,
  },
});

export const actions = dataSlice.actions;
export default dataSlice.reducer;
