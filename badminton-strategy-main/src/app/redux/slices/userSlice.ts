import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@src/app/datasource/user.type';

export interface UserState {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  imageUrl: string;
  authenticated: boolean;
}

const initialState: UserState = {
  email: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  country: '',
  licenseNumber: '',
  imageUrl: '',
  authenticated: true,
};

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.birthdate = action.payload.birthdate;
      state.country = action.payload.country;
      state.licenseNumber = action.payload.licenseNumber;
      state.imageUrl = action.payload.imageUrl;
    },
    logoutUser(state) {
      state.email = '';
      state.firstName = '';
      state.lastName = '';
      state.birthdate = '';
      state.country = '';
      state.licenseNumber = '';
      state.authenticated = false;
      state.imageUrl = '';
    },
  },
});

export const { setAuthenticated, setEmail, setUser, logoutUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
