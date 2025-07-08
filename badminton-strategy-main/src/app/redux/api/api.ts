import { REACT_APP_API_URL } from '@env';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '@src/app/store';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { setAuthenticated } from '../slices/userSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: REACT_APP_API_URL,
    prepareHeaders: async headers => {
        let accessToken = '';
        try {
            const { tokens } = await fetchAuthSession();
            accessToken = tokens?.accessToken?.toString() ?? '';
        } catch (error) {
            console.error('Error fetching session:', error);
            accessToken = '';
            await signOut();
            store.dispatch(setAuthenticated(false));
            throw new Error('FailedToAuth');
        }
        headers.set('Authorization', `${accessToken}`);
        return headers;
    },
});
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  console.log(result)
  return result;
};
