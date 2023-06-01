import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return status >= 200;
  },
};

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (msgData) => {
    const response = await axios.post(`api/v1/message/`, msgData, options);
    if (response.status >= 200 && response.status < 300) {
      // If response status is 2xx, return the data as usual
      return response.data;
    } else {
      // If response status is not 2xx, throw an error with the full response
      throw new Error(JSON.stringify(response.data));
    }
  }
);

const sendMessageSlice = createSlice({
  name: "messages",
  initialState: {
    chatData: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.chatData = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});
export const { updateChatData } = sendMessageSlice.actions;

export default sendMessageSlice.reducer;
