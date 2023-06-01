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

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (searchQuery) => {
    const response = await axios.get(
      `api/v1/user/search?search=${searchQuery}`,
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
const searchSlice = createSlice({
  name: "searchUser",
  initialState: {
    usersArr: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.usersArr = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.usersArr = {};
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default searchSlice.reducer;
