import React from "react";
import "./Welcome.css";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPassword from "./ForgotPassword";
const Welcome = () => {
  // const dispatch = useDispatch();
  const [overlay, setOverlay] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // for handling overLay
  const overlayHandlerSignUp = () => {
    setOverlay(true);
  };
  const overlayHandlerLogIn = () => {
    setOverlay(false);
    setShowForgotPassword(false);
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
          <SignUpForm />

          {showForgotPassword ? (
            <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
          ) : (
            <SignInForm setShowForgotPassword={setShowForgotPassword} />
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
