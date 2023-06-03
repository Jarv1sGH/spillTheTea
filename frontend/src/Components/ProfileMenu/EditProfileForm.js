import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editProfile } from "../../Reducers/userReducers/editProfileSlice";
import Loader from "../Loader/Loader";
const EditProfileForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.editProfile);
  const [formData, setFormData] = useState({
    name: user?.user?.name,
    email: user?.user?.email,
    aboutMe: user?.user?.aboutMe ? user?.user?.aboutMe : "",
  });
  const formInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //If user update profile pic
  const fileInputRef = useRef();
  const handleFileInputChange = () => {
    const profilePicImg = fileInputRef.current.files[0];
    setFormData({
      ...formData,
      profilePic: profilePicImg,
    });
  };
  const editFormSubmit = (e) => {
    e.preventDefault();
    dispatch(editProfile(formData));
  };
  return (
    <>
      {loading === true ? (
        <div className="userContainer">
          <Loader />
        </div>
      ) : (
        <div className="userContainer" style={{ justifyContent: "center" }}>
          <h2 style={{ margin: "0" }}>Edit Profile</h2>
          <form onSubmit={editFormSubmit}>
            <div className="updatePassword">
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={formInputChange}
                pattern=".{3,}"
                title="Name must be atleast 3 characters"
                autoComplete="off"
                required
              />
            </div>
            <div className="updatePassword">
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={formInputChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="updatePassword">
              <input
                className="input"
                name="aboutMe"
                type="text"
                placeholder="About Me"
                value={formData.aboutMe}
                onChange={formInputChange}
                autoComplete="off"
              />
            </div>
            <div className="updatePassword">
              <input
                className="input"
                type="file"
                name="profilePic"
                onChange={handleFileInputChange}
                ref={fileInputRef}
                autoComplete="off"
              />
            </div>
            <div className="updatePassword">
              <button type="submit" style={{ marginTop: "9px" }}>
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditProfileForm;
