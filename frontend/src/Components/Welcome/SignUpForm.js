import React from "react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser} from "../../Reducers/userReducers/userSlice";
const SignUpForm = () => {
  const dispatch = useDispatch();
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
          <i className="fa-solid fa-user"></i>
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
          <i className="fa-solid fa-envelope"></i>
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
          <i className="fa-solid fa-lock"></i>
          <input
            name="password"
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            placeholder="Password*"
            value={formData.password}
            onChange={signUpInputChange}
            required
            autoComplete="off"
            title="password must be Alpha-Numeric, 8+ characters long and contain atleast 1 special character."
          />
        </label>
        <p id="passwordCriteria">
          (password must be Alpha-Numeric, 8+ characters long and contain 1
          special character.)
        </p>
        <label>
          <i className="fa-regular fa-image"></i>
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
