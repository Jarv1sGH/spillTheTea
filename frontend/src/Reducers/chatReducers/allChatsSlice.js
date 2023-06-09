import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {options} from "../../chatLogic";

export const fetchAllChats = createAsyncThunk(
  "chats/fetchAllChats",
  async () => {
    const response = await axios.get(`api/v1/chats`, options);
    if (response.status >= 200 && response.status < 300) {
      // If response status is 2xx, return the data as usual
      return response.data;
    } else {
      // If response status is not 2xx, throw an error with the full response
      throw new Error(JSON.stringify(response.data));
    }
  }
);

const allChatsSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default allChatsSlice.reducer;
