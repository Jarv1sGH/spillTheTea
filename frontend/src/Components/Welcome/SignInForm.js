import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducers/userReducers/userSlice";
const SignInForm = (props) => {
  const dispatch = useDispatch();
  const { setShowForgotPassword } = props;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //SignIn form data
  const signInInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const signInFormSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  const onClickHandler = () => {
    setShowForgotPassword(true);
  };
  return (
    <div className=" formContainer signIn">
      <form onSubmit={signInFormSubmit}>
        <h1>Sign In</h1>
        <label>
          <i className="fa-solid fa-envelope"></i>{" "}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={signInInputChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          <i className="fa-solid fa-lock"></i>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={signInInputChange}
            required
            autoComplete="off"
          />
        </label>
        <p id="forgotPasswordText" onClick={onClickHandler}>
          Forgot your password?
        </p>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default SignInForm;
