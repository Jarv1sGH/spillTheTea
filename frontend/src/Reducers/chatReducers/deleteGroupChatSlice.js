import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "../../chatLogic";

export const deleteGroupChat = createAsyncThunk(
  "chat/delete",
  async ({ data }) => {
    const response = await axios.delete(
      `api/v1/chat/group/delete`,
      { data },
      options
    );
    if (response.status >= 200 && response.status < 300) {
      // If response status is 2xx, return the data as usual
      return response.data;
    } else {
      // If response status is not 2xx, throw an error with the full response
      throw new Error(JSON.stringify(response.data));
    }
  }
);

export const leaveGroupChat = createAsyncThunk("chat/leave", async (chatId) => {
  const response = await axios.put(
    `api/v1/chat/group/leave`,
    {
      chatId,
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

const deleteGroupChatSlice = createSlice({
  name: "deleteGroupChat",
  initialState: {
    deletionResponse: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder

      //delete group chat
      .addCase(deleteGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroupChat.fulfilled, (state, action) => {
        state.deletionResponse = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(deleteGroupChat.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      })

      // leave group chat
      .addCase(leaveGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(leaveGroupChat.fulfilled, (state, action) => {
        state.deletionResponse = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(leaveGroupChat.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default deleteGroupChatSlice.reducer;
