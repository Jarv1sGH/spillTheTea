import React, { useEffect } from "react";
import "./Welcome.css";
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPassword from "./ForgotPassword";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const [overlay, setOverlay] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  // for handling overLay
  const overlayHandlerSignUp = () => {
    setOverlay(true);
    // waits for the form transition to finish
    setTimeout(() => {
      setShowLoginForm(false);
    }, 300);
  };
  const overlayHandlerLogIn = () => {
    setOverlay(false);
    setShowForgotPassword(false);
    setShowLoginForm(true);
  };

  useEffect(() => {
    if (loading === false)
      if (isAuthenticated === true) {
        navigate("/chats");
      }
  }, [isAuthenticated, loading, navigate]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
            {/* // Added another state check as SignInForm was clearing the error state for SignUpForm as well, this 
            way SignInform gets unmounted and doesn't interfere with SignUpForm */}
            {showLoginForm && (
              <>
                {showForgotPassword ? (
                  <ForgotPassword
                    setShowForgotPassword={setShowForgotPassword}
                  />
                ) : (
                  <SignInForm setShowForgotPassword={setShowForgotPassword} />
                )}
              </>
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
      )}
    </>
  );
};

export default Welcome;
