import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/userReducers/userSlice";
import forgotPasswordReducer from "./Reducers/userReducers/forgotPasswordSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export default store;
