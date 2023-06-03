import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  forgotPassword,
  clearState,
} from "../../Reducers/userReducers/forgotPasswordSlice";
const ForgotPassword = (props) => {
  const { message, error } = useSelector((state) => state.forgotPassword);
  const [formData, setFormData] = useState({
    email: "",
  });
  const dispatch = useDispatch();
  const { setShowForgotPassword } = props;
  const onClickHandler = () => {
    setShowForgotPassword(false);
  };
  //forgotPassword form data
  const forgotPasswordInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message?.message) {
      toast(message.message);
    }
    if (error?.error) {
      toast(error?.error);
    }
  }, [message, error]);

  useEffect(() => {
    return () => {
      // Reset the error state when component is unmounted or hidden to avoid multiple toasts of same error
      dispatch(clearState());
    };
  }, [dispatch]);
  return (
    <div className=" formContainer signIn">
      <button id="backBtn" onClick={onClickHandler}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <form className="forgotPassword" onSubmit={forgotPasswordSubmit}>
        <h1>Forgot Password</h1>
        <label>
          <input
            type="email"
            name="email"
            placeholder="Enter email associated with your account"
            value={formData.email}
            onChange={forgotPasswordInputChange}
            required
            autoComplete="off"
          />
        </label>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
