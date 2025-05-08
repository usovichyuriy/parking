import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import parkingSpotReducer from "./parkingSpotSlice";
import reservationReducer from "./reservationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parkingSpot: parkingSpotReducer,
    reservation: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
