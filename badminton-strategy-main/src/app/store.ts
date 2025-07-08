import { configureStore } from '@reduxjs/toolkit';

import { userApi } from './redux/api/userApi';
import rootReducer from './redux/rootReducer';
import { matchApi } from './redux/api/matchApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      matchApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
