import { configureStore } from '@reduxjs/toolkit';
import { attendanceApi } from './api/attendanceApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(attendanceApi.middleware),
});
