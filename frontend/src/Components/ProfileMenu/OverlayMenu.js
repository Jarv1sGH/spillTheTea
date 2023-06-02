import React, { useEffect, useState } from "react";
import "./OverlayMenu.css";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Reducers/userReducers/userSlice";
import UpdatePasswordForm from "./UpdatePasswordForm";
import EditProfileForm from "./EditProfileForm";

const OverlayMenu = ({ innerRef, settingsActive, notify }) => {
  const dispatch = useDispatch();
  const { user, message } = useSelector((state) => state.user);
  const [profileActive, setProfileActive] = useState(true);
  const [listOption, setListOption] = useState(null);
  const handleListClick = (item) => {
    setListOption(item);
    setProfileActive(false);
  };
  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (window.location.pathname === "/") {
      notify(message?.message);
    }
  }, [notify, message]);

  return (
    <div
      ref={innerRef}
      className={`menuContainer ${settingsActive ? "slideRight" : ""}`}
    >
      <div className="options">
        <ul>
          <li
            onClick={() => handleListClick("profile")}
            className={
              listOption === "profile" || profileActive ? "active" : ""
            }
          >
            <i className="fa-solid fa-user"></i> My Profile
          </li>
          <li
            onClick={() => handleListClick("editProfile")}
            className={listOption === "editProfile" ? "active" : ""}
          >
            <i className="fa-regular fa-pen-to-square"></i> Edit Profile
          </li>
          <li
            onClick={() => handleListClick("password")}
            className={listOption === "password" ? "active" : ""}
          >
            <i className="fa-solid fa-lock"></i> Update Password
          </li>
          <li onClick={logoutHandler}>
            <i className="fa-solid fa-power-off"></i> Logout
          </li>
        </ul>
      </div>

      {(listOption === "profile" || profileActive) && (
        <div className="userContainer">
          <div className="userAvatar">
            <img src={user?.user?.profilePic?.url} alt="" />
          </div>
          <div className="userInfo">
            <p>{user?.user?.name}</p>
            <p>
              {" "}
              <i className="fa-solid fa-envelope blueIcon"></i>{" "}
              {user?.user?.email}
            </p>
            <div className="aboutMe">
              <span>
                {" "}
                <i className="fa-solid fa-address-card blueIcon"></i> About Me
              </span>
              <p>
                {user?.user?.aboutMe
                  ? user?.user?.aboutMe
                  : "No about me added"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* edit profile form */}

      {listOption === "editProfile" && <EditProfileForm notify={notify} />}

      {/* Update Password form */}

      {listOption === "password" && <UpdatePasswordForm notify={notify} />}
    </div>
  );
};

export default OverlayMenu;
