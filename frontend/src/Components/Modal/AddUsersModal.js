import React from "react";
import { useSelector } from "react-redux";
const AddUsersModal = ({ addUsersModal }) => {
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const closeModal = () => {
    addUsersModal.current.close();
  };
  return (
    <div className="groupModalInner">
      <i
        title="close"
        onClick={closeModal}
        className="fa-solid fa-xmark blueIcon"
      ></i>
      <div className="groupName">
        <h3>Add users to {selectedChat.chatName}</h3>
      </div>
      <div className="searchBar">
            
      </div>
    </div>
  );
};

export default AddUsersModal;
