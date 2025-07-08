import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { userApi } from './api/userApi';
import { matchApi } from './api/matchApi';
import { matchReducer } from './slices/matchSlice';

const rootReducer = combineReducers({
  user: userReducer,
  match: matchReducer,
  [userApi.reducerPath]: userApi.reducer,
  [matchApi.reducerPath]: matchApi.reducer,
});

export default rootReducer;
