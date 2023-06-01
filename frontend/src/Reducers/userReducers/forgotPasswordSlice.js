import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "../../chatLogic";

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (formData) => {
    const response = await axios.post(
      `api/v1/password/forgot`,
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
export const clearState = () => (dispatch) => {
  dispatch(forgotPasswordSlice.actions.setState(null));
};
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    message: {},
    loading: false,
    error: null,
  },
  reducers: {
    setState: (state, action) => {
      state.error = action.payload;
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default forgotPasswordSlice.reducer;
