import React from "react";
import "./Welcome.css";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../Reducers/userReducers/userSlice";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPassword from "./ForgotPassword";
const Welcome = () => {
  const dispatch = useDispatch();
  const [overlay, setOverlay] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  });

  // for handling overLay
  const overlayHandlerSignUp = () => {
    setOverlay(true);
  };
  const overlayHandlerLogIn = () => {
    setOverlay(false);
    setForgotPassword(false);
  };

  //SignUp form data
  const signUpInputChange = (e) => {
    setSignUpFormData({
      ...signUpFormData,
      [e.target.name]: e.target.value,
    });
  };

  //SignIn form data
  const signInInputChange = (e) => {
    setSignInFormData({
      ...signInFormData,
      [e.target.name]: e.target.value,
    });
  };

  //forgotPassword form data
  const forgotPasswordInputChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  //If user includes a profile pic
  const fileInputRef = useRef();
  const handleFileInputChange = () => {
    const profilePicImg = fileInputRef.current.files[0];
    setSignUpFormData({
      ...signUpFormData,
      profilePic: profilePicImg,
    });
  };

  const signUpFormSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(signUpFormData));
  };
  const signInFormSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(signInFormData));
  };
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    // dispatch(forgotPassword(forgotPasswordData));
  };

  return (
    <>
      <div className="welcomeContainer">
        <div className="welcome">
          <h1 id="welcomeText">Welcome to SpillTheTea</h1>
        </div>

        <div
          className={
            overlay
              ? "LoginSignContainer rightPanelActive "
              : "LoginSignContainer "
          }
        >
          <SignUpForm
            signUpFormSubmit={signUpFormSubmit}
            signUpFormData={signUpFormData}
            signUpInputChange={signUpInputChange}
            handleFileInputChange={handleFileInputChange}
            fileInputRef={fileInputRef}
          />

          {forgotPassword ? (
            <ForgotPassword
              setForgotPassword={setForgotPassword}
              forgotPasswordData={forgotPasswordData}
              forgotPasswordSubmit={forgotPasswordSubmit}
              forgotPasswordInputChange={forgotPasswordInputChange}
            />
          ) : (
            <SignInForm
              signInFormSubmit={signInFormSubmit}
              signInInputChange={signInInputChange}
              signInFormData={signInFormData}
              setForgotPassword={setForgotPassword}
            />
          )}

          {/* Overlay */}
          <div className="overlayContainer">
            <div className="overlay">
              <div className="overlayPanel overlayLeft">
                <h1>Sign In</h1>
                <p>Already have an account? Sign In instead... </p>
                <button onClick={overlayHandlerLogIn} className="ghost mt-5">
                  Sign In Here
                </button>
              </div>
              <div className="overlayPanel overlayRight">
                <h1>Create An Account!</h1>
                <p> Don't have an account? Sign Up here ... </p>
                <button onClick={overlayHandlerSignUp} className="ghost">
                  Sign Up here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
