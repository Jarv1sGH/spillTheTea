import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const options = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  validateStatus: (status) => {
    return status >= 200;
  },
};

export const editGroupChat = createAsyncThunk(
  "chat/editGroupChat",
  async (formData) => {
    const response = await axios.put(
      `api/v1/chat/group/update`,
      formData,
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
export const removeUser = createAsyncThunk("chat/removeUser", async (data) => {
  const response = await axios.put(`api/v1/chat/group/remove`, data, options);
  if (response.status >= 200 && response.status < 300) {
    // If response status is 2xx, return the data as usual
    return response.data;
  } else {
    // If response status is not 2xx, throw an error with the full response
    throw new Error(JSON.stringify(response.data));
  }
});

const editGroupChatSlice = createSlice({
  name: "editGroupChat",
  initialState: {
    updatedGroupChat: [],
    reloadChatList: false,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // edit group
      .addCase(editGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(editGroupChat.fulfilled, (state, action) => {
        state.updatedGroupChat = action.payload;
        state.reloadChatList = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(editGroupChat.rejected, (state, action) => {
        state.loading = false;
        state.newChat = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      })

      // remove user

      .addCase(removeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.updatedGroupChat = action.payload;
        state.reloadChatList = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(removeUser.rejected, (state, action) => {
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

export default editGroupChatSlice.reducer;
