import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://your-backend.example.com/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    punch: builder.mutation({
      query: (body) => ({
        url: '/attendance/punch',
        method: 'POST',
        body,
      }),
    }),
    getTimesheets: builder.query({
      query: (userId) => `/timesheets?userId=${userId}`,
    }),
    getPayslips: builder.query({
      query: (userId) => `/payslips?userId=${userId}`,
    }),
  }),
});

export const { usePunchMutation, useGetTimesheetsQuery, useGetPayslipsQuery } = attendanceApi;
