import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearErrors } from "../../Reducers/userReducers/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignInForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);
  const { setShowForgotPassword } = props;
  const [passwordInputType, setPasswordInputType] = useState("password");
  const showPassword = () => {
    setPasswordInputType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };
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
    navigate("/chats");
  };

  // To show toast on invalid login credentials
  const prevErrorRef = useRef(null);
  useEffect(() => {
    if (prevErrorRef.current !== error?.error) {
      if (error?.error) {
        toast(error.error);
      }
      prevErrorRef.current = error?.error;
    }
  }, [error]);

  //clear errors when component is unmounted to prevent multiple same error toasts
  useEffect(() => {
    return () => {
      // Reset the error state when component is unmounted or hidden
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const onClickHandler = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className=" formContainer signIn">
      <form onSubmit={signInFormSubmit}>
        <h1>Sign In</h1>
        <label>
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
          <input
            name="password"
            type={passwordInputType}
            placeholder="Password"
            value={formData.password}
            onChange={signInInputChange}
            required
            autoComplete="off"
          />
          <div className="eyeIcon">
            <i
              onClick={showPassword}
              className={
                passwordInputType === "password"
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            ></i>
          </div>
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
