import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "../../chatLogic";

export const registerUser = createAsyncThunk(
  "user/resgisterUser",
  async (formData) => {
    const response = await axios.post(`api/v1/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      validateStatus: (status) => {
        return status >= 200;
      },
    });
    if (response.status >= 200 && response.status < 300) {
      // If response status is 2xx, return the data as usual
      return response.data;
    } else {
      // If response status is not 2xx, throw an error with the full response
      throw new Error(JSON.stringify(response.data));
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData) => {
    const response = await axios.post(`api/v1/login`, formData, options);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(JSON.stringify(response.data));
    }
  }
);
export const loadUser = createAsyncThunk("user/loadUser", async () => {
  const response = await axios.get(`api/v1/me`, options);
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(JSON.stringify(response.data));
  }
});
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  const response = await axios.get(`api/v1/logout`, options);
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(JSON.stringify(response.data));
  }
});
export const clearErrors = () => (dispatch) => {
  dispatch(userSlice.actions.setError(null));
};
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: false,
    isAuthenticated: false,
    message: null,
    error: null,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //Register user
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loading = true;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.message = "Registered Successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      })

      //Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.loading = false;
        state.message = "Logged In Successfully";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      })

      //Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.message = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.message = null;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      })

      //Logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message = null;
        try {
          state.error = JSON.parse(action.error.message);
        } catch (error) {
          state.error = action.error.message;
        }
      });
  },
});

export default userSlice.reducer;
