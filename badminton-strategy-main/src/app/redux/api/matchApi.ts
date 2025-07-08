import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './api';
import {
  Match,
  PostMatch,
  PutMatch,
  DeleteMatch,
} from '@src/app/datasource/match.type';
import { ApiResponse } from '@src/app/datasource/response.type';
import { MatchAnalysisResult, PostMatchAnalysisResult } from '@src/app/datasource/analyzeMatchResult.type';

export const matchApi = createApi({
  reducerPath: 'matchApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMatches: builder.mutation<{"matches": Match[], "message": string}, void>({
      query: () => `/match`,
    }),
    postMatch: builder.mutation<{message: string; match: Match}, PostMatch>(
      {
        query: (body) => {
          return {
            url: '/match',
            method: 'POST',
            body,
          };
        },
      }
    ),
    putMatch: builder.mutation<ApiResponse, PutMatch>(
      {
        query: (body) => {
          return {
            url: '/match',
            method: 'PUT',
            body,
          };
        },
      }
    ),
    deleteMatch: builder.mutation<ApiResponse, DeleteMatch>({
      query: (body) => {
        return {
          url: '/match',
          method: 'DELETE',
          body,
        };
      },
    }),
     postAnalyzeMatchResult: builder.mutation<{ "advice" : MatchAnalysisResult, message: string}, PostMatchAnalysisResult>(
      {
        query: (body) => {
          return {
            url: '/analyze',
            method: 'POST',
            body,
          };
        },
      }
    ),
  }),
});

export const {
  useDeleteMatchMutation,
  useGetMatchesMutation,
  usePostMatchMutation,
  usePutMatchMutation,
  usePostAnalyzeMatchResultMutation
} = matchApi;
