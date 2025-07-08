
import { logoutUser } from './redux/slices/userSlice';
import { AppDispatch } from './store';
import { createAction } from '@reduxjs/toolkit';

export const logoutAll = () => (dispatch: AppDispatch) => {
  dispatch(logoutUser());
  dispatch(globalLogout());
};

export const globalLogout = createAction('auth/globalLogout');
