import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';
import {
  User,
  PostUserResponse,
  PostUser,
  PutUserResponse,
  PutUser,
} from '@src/app/datasource/user.type';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.mutation<User, void>({
      query: () => `/user`,
    }),
    getUserByUsername: builder.mutation<User[], string>({
      query: (username) => `/user/${username}`,
    }),
    postUser: builder.mutation<PostUserResponse, PostUser>({
      query: (body) => {
        return {
          url: '/user',
          method: 'POST',
          body,
        };
      },
    }),
    putUser: builder.mutation<PutUserResponse, PutUser>({
      query: (body) => {
        return {
          url: '/user',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetUserMutation,
  useGetUserByUsernameMutation,
  usePostUserMutation,
  usePutUserMutation,
} = userApi;
