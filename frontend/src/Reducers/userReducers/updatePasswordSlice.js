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

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (formData) => {
    const response = await axios.put(
      `api/v1/password/update`,
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
export const clearError = () => (dispatch) => {
  dispatch(updatePasswordSlice.actions.setError(null));
};
const updatePasswordSlice = createSlice({
  name: "updatePassword",
  initialState: {
    message: {},
    loading: false,
    error: null,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default updatePasswordSlice.reducer;
