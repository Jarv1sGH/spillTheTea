import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const options = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  validateStatus: (status) => {
    return status >= 200;
  },
};

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (formData) => {
    const response = await axios.put(`api/v1/me/update`, formData, options);
    if (response.status >= 200 && response.status < 300) {
      // If response status is 2xx, return the data as usual
      return response.data;
    } else {
      // If response status is not 2xx, throw an error with the full response
      throw new Error(JSON.stringify(response.data));
    }
  }
);

const editProfileSlice = createSlice({
  name: "editProfile",
  initialState: {
    message: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default editProfileSlice.reducer;
