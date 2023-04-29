import React from "react";
// import { Link } from "react-router-dom";
// import "./Welcome.css";
const ForgotPassword = (props) => {
  const {
    setForgotPassword,
    forgotPasswordData,
    forgotPasswordSubmit,
    forgotPasswordInputChange,
  } = props;
  const onClickHandler = () => {
    setForgotPassword(false);
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
            value={forgotPasswordData.email}
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
