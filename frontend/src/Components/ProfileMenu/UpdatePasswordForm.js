import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  clearError,
} from "../../Reducers/userReducers/updatePasswordSlice";
import { toast } from "react-toastify";
const UpdatePasswordForm = () => {
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.updatePassword);
  const [passwordInputType, setPasswordInputType] = useState({
    oldPass: "password",
    newPass: "password",
    confirmPass: "password",
  });
  const showPassword = (inputId) => {
    setPasswordInputType((prevInputTypes) => ({
      ...prevInputTypes,
      [inputId]: prevInputTypes[inputId] === "password" ? "text" : "password",
    }));
  };
  const [updatePasswordForm, setUpdatePasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const updatePasswordInputChange = (e) => {
    setUpdatePasswordForm({
      ...updatePasswordForm,
      [e.target.name]: e.target.value,
    });
  };

  const updatePasswordFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword(updatePasswordForm));
  };

  useEffect(() => {
    if (error?.error) {
      toast(error?.error);
    }
    if (message?.success === true) {
      toast("Password Changed Successfully");
    }
  }, [error,message]);

  // clears error when component is unmounted to avoid multiple same toasts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="userContainer passwordContainer">
      <h2 style={{ margin: "0" }}>Update Password</h2>
      <form onSubmit={updatePasswordFormSubmit}>
        <div className="updatePassword">
          <input
            type={passwordInputType.oldPass}
            className="input"
            name="oldPassword"
            required
            value={updatePasswordForm.oldPassword}
            onChange={updatePasswordInputChange}
            placeholder="old password"
          />
          <div className="eyeIcon">
            <i
              onClick={() => showPassword("oldPass")}
              className={
                passwordInputType.oldPass === "password"
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            ></i>
          </div>
        </div>
        <div className="updatePassword">
          <input
            className="input"
            name="newPassword"
            type={passwordInputType.newPass}
            required
            value={updatePasswordForm.newPassword}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            onChange={updatePasswordInputChange}
            placeholder="new password"
            title="password must be Alpha-Numeric, 8+ characters long and contain atleast 1 special character."
          />
          <div className="eyeIcon">
            <i
              onClick={() => showPassword("newPass")}
              className={
                passwordInputType.newPass === "password"
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            ></i>
          </div>
        </div>
        <div className="updatePassword">
          <input
            className="input"
            name="confirmPassword"
            type={passwordInputType.confirmPass}
            required
            value={updatePasswordForm.confirmPassword}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            onChange={updatePasswordInputChange}
            placeholder="confirm password"
            title="password must be Alpha-Numeric, 8+ characters long and contain atleast 1 special character."
          />
          <div className="eyeIcon">
            <i
              onClick={() => showPassword("confirmPass")}
              className={
                passwordInputType.confirmPass === "password"
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            ></i>
          </div>
        </div>
        <div className="updatePassword">
          <button type="submit" id="updatePasswordBtn">
            Change
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
