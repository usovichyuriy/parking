import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";

interface IParkingSpot {
  id: number;
  location: string;
}

interface IParkingSpotState {
  parkingSpots: IParkingSpot[];
}

const initialState: IParkingSpotState = {
  parkingSpots: [],
};

export const getParkingSpots = createAsyncThunk(
  "parking-spots/getParkingSpots",
  async () => {
    const response = await api.get("parking-spots");
    return response.data;
  }
);

const parkingSpotSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    setParkingSlots(state, action: PayloadAction<IParkingSpot[]>) {
      state.parkingSpots = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getParkingSpots.fulfilled, (state, action) => {
      state.parkingSpots = action.payload;
    });
  },
});

export const { setParkingSlots } = parkingSpotSlice.actions;
export default parkingSpotSlice.reducer;
