import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {options} from "../../chatLogic";

export const newChatCreator = createAsyncThunk("chat/newChat", async (recipientId) => {
  const response = await axios.post(
    `api/v1/chat`,
    {
      recipientId: recipientId,
    },
    options
  );
  if (response.status >= 200 && response.status < 300) {
    // If response status is 2xx, return the data as usual
    return response.data;
  } else {
    // If response status is not 2xx, throw an error with the full response
    throw new Error(JSON.stringify(response.data));
  }
});

const newChatSlice = createSlice({
  name: "newchat",
  initialState: {
    newChat: [],
    reloadChatList:false,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(newChatCreator.pending, (state) => {
        state.loading = true;
      })
      .addCase(newChatCreator.fulfilled, (state, action) => {
        state.newChat = action.payload;
        state.reloadChatList = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(newChatCreator.rejected, (state, action) => {
        state.loading = false;
        state.newChat = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default newChatSlice.reducer;
