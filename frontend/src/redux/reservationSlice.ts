import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";
import { AxiosError } from "axios";

export interface IReservation {
  id: number;
  parking_spot_number: number;
  reserved_date: string;
  reserved_time: string;
  status: string;
}

export interface IReservationState {
  parking_spot_id: number | null;
  availableTime: string[];
  selectedDate: string | null;
  reservationHistory: IReservation[];
  error: string | null;
  toastShow: boolean;
}

const initialState: IReservationState = {
  parking_spot_id: null,
  availableTime: [],
  selectedDate: null,
  reservationHistory: [],
  error: null,
  toastShow: false,
};

export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async ({
    spotId,
    reservedDate,
    reservedTime,
  }: {
    spotId: number;
    reservedDate: string;
    reservedTime: string;
  }) => {
    const response = await api.post(`reservations`, {
      spotId,
      reservedDate,
      reservedTime,
    });
    return response.data;
  }
);

export const getUserReservations = createAsyncThunk(
  "reservations/getUserReservations",
  async (user_id: number) => {
    const response = await api.get(`reservations/${user_id}`);
    return response.data;
  }
);

export const cancelReservation = createAsyncThunk(
  "reservations/cancelReservation",
  async (reservation_id: number) => {
    try {
      await api.delete(`reservations/${reservation_id}`);
      return reservation_id;
    } catch (receivedError) {
      const axiosError = receivedError as AxiosError<{ error: string }>;
      return axiosError.response?.data?.error;
    }
  }
);

export const getAvailableTimeForSpot = createAsyncThunk(
  "parking-spots/getAvailableTimeForSpot",
  async ({
    parking_spot_id,
    date,
  }: {
    parking_spot_id: number;
    date: string;
  }) => {
    const response = await api.get(
      `parking-spots/${parking_spot_id}/available-times?date=${date}`
    );
    return response.data;
  }
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setCurrentSpotId(state, action: PayloadAction<number>) {
      state.parking_spot_id = action.payload;
      state.availableTime = [];
    },
    setAvailableTime(state, action: PayloadAction<string[]>) {
      state.availableTime = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setReservationHistory(state, action: PayloadAction<IReservation[]>) {
      state.reservationHistory = action.payload;
    },
    clearReservationError(state) {
      state.error = null;
    },
    changeToastShow(state) {
      state.toastShow = !state.toastShow;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservationHistory.push(action.payload);
      })
      .addCase(getUserReservations.fulfilled, (state, action) => {
        state.reservationHistory = action.payload;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        if (typeof action.payload === "number") {
          const reservationIndex = state.reservationHistory.findIndex(
            (reservation) => reservation.id === action.payload
          );

          if (reservationIndex !== -1) {
            state.reservationHistory[reservationIndex] = {
              ...state.reservationHistory[reservationIndex],
              status: "cancelled",
            };
          }
        } else {
          state.error = String(action.payload);
        }
      })
      .addCase(getAvailableTimeForSpot.fulfilled, (state, action) => {
        state.availableTime = action.payload;
      });
  },
});

export const {
  setCurrentSpotId,
  setAvailableTime,
  setSelectedDate,
  setReservationHistory,
  clearReservationError,
  changeToastShow,
} = reservationSlice.actions;
export default reservationSlice.reducer;
