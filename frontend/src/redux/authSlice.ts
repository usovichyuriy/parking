import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";
import { AxiosError } from "axios";

export interface IAuthState {
  userId: number | null;
  isAuth: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  userId: Number(localStorage.getItem("userId")),
  isAuth: localStorage.getItem("isAuth") === "false",
  error: null,
};

export const authUser = createAsyncThunk(
  "auth/registerOrLoginUser",
  async ({
    email,
    password,
    mode,
  }: {
    email: string;
    password: string;
    mode: string;
  }) => {
    try {
      const response = await api.post(`auth/${mode}`, { email, password });
      return response.data;
    } catch (receivedError) {
      const axiosError = receivedError as AxiosError<{
        error: string;
        message?: string[];
      }>;

      if (axiosError.response?.data.message) {
        return axiosError.response.data.message.join(", ");
      }

      return axiosError.response?.data?.error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      if (action.payload !== undefined) {
        state.userId = action.payload;
        state.isAuth = true;
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authUser.fulfilled, (state, action) => {
      if (action.payload.user) {
        state.userId = action.payload.user.id;
        state.isAuth = true;
        state.error = null;

        localStorage.setItem("userId", action.payload.user.id);
        localStorage.setItem("isAuth", "true");
      } else {
        state.error = action.payload;
        localStorage.removeItem("userId");
      }
    });
  },
});

export const { setUserId, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
