import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../Reducers/userReducers/forgotPasswordSlice";
const ForgotPassword = (props) => {
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
