import React, { useState, useRef, useEffect } from "react";
import "./EditGroupModal.css";
import { useDispatch, useSelector } from "react-redux";
import { editGroupChat } from "../../Reducers/chatReducers/editGroupChatSlice";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const EditGroupModal = ({ modalRef }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.updatedGroupChat);
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const [formData, setFormData] = useState({
    chatId: selectedChat?._id,
    chatName: selectedChat?.chatName,
  });
  const formInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //If user updates the group icon
  const fileInputRef = useRef(null);
  const handleFileInputChange = () => {
    const groupIconImg = fileInputRef.current.files[0];
    setFormData({
      ...formData,
      groupIcon: groupIconImg,
    });
  };
  const closeModal = () => {
    modalRef.current.close();
  };

  const groupChatUpdater = (e) => {
    e.preventDefault();
    if (
      formData.chatName === "" &&
      fileInputRef.current.files[0] === undefined
    ) {
      return toast("No changes made");
    }
    dispatch(editGroupChat(formData)).then((action) => {
      const updatedData = action.payload;
      if (updatedData.success === true) {
        modalRef.current.close();
        toast(updatedData.message);
      }
    });
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      chatId: selectedChat?._id,
      chatName: selectedChat?.chatName,
    }));
  }, [selectedChat]);

  return (
    <>
      {loading ? (
        <div className="groupModalInner">
          <Loader />
        </div>
      ) : (
        <div className="groupModalInner">
          <i
            title="close"
            onClick={closeModal}
            className="fa-solid fa-xmark blueIcon"
          ></i>
          <h2> Edit Group Chat</h2>
          <form onSubmit={groupChatUpdater} className="modalForm">
            <div className="modalInputContainer">
              <div className="updatePassword modalInput">
                <p>Group Name</p>
                <input
                  className="input"
                  name="chatName"
                  type="text"
                  placeholder="Group Name"
                  value={formData.chatName}
                  onChange={formInputChange}
                  autoComplete="off"
                  required
                  pattern=".*\S+.*"
                />
              </div>
              <div className="updatePassword modalInput">
                <p>Group Icon</p>
                <input
                  className="input"
                  type="file"
                  name="groupIcon"
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  autoComplete="off"
                />
              </div>
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditGroupModal;
