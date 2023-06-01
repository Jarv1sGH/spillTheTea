import React from "react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../Reducers/userReducers/userSlice";
const SignUpForm = () => {
  const dispatch = useDispatch();
  const [passwordInputType, setPasswordInputType] = useState("password");
  const showPassword = () => {
    setPasswordInputType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //SignUp form data
  const signUpInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //If user includes a profile pic
  const fileInputRef = useRef();
  const handleFileInputChange = () => {
    const profilePicImg = fileInputRef.current.files[0];
    setFormData({
      ...formData,
      profilePic: profilePicImg,
    });
  };
  const signUpFormSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className=" formContainer signUp">
      <form onSubmit={signUpFormSubmit}>
        <h1>Sign Up</h1>
        <label>
          <input
            type="text"
            name="name"
            placeholder="Name*"
            value={formData.name}
            onChange={signUpInputChange}
            pattern=".{3,}"
            title="Name must be atleast 3 characters"
            required
            autoComplete="off"
          />
        </label>
        <label>
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={signUpInputChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          <input
            name="password"
            type={passwordInputType}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            placeholder="Password*"
            value={formData.password}
            onChange={signUpInputChange}
            required
            autoComplete="off"
            title="password must be Alpha-Numeric, 8+ characters long and contain atleast 1 special character."
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
        <p id="passwordCriteria">
          (password must be Alpha-Numeric, 8+ characters long and contain 1
          special character.)
        </p>
        <label>
          <input
            type="file"
            name="profilePic"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            autoComplete="off"
          />
        </label>
        <button type="submit" style={{ marginTop: "9px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
