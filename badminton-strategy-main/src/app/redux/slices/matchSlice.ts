import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Match } from '@src/app/datasource/match.type';
import { User } from '@src/app/datasource/user.type';

export interface PublicationState {
  matches: Match[];
  match: Match | null;
}

const initialState: PublicationState = {
  matches: [],
  match: null,
};

export const matchSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setMatches(state, action: PayloadAction<Match[]>) {
      state.matches = action.payload;
    },
    setMatch(state, action: PayloadAction<Match>) {
      state.match = action.payload;
    },
  },
});

export const { setMatches, setMatch } =
  matchSlice.actions;

export const matchReducer = matchSlice.reducer;
