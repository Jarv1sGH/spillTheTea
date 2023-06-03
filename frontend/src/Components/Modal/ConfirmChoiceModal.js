import React from "react";
import "./EditGroupModal.css";

const ConfirmChoiceModal = (props) => {
  const {
    choiceModal,
    showDeleteModal,
    removeUserId,
    setRemoveUserData,
    selectedChat,
  } = props;
  const closeModal = () => {
    choiceModal.current.close();
  };

  console.log(removeUserId);
  const removeUserHandler = () => {
    setRemoveUserData((prevRemoveData) => ({
      ...prevRemoveData,
      userId: removeUserId.userId,
    }));
  };
  const deleteGroupChatHandler = () => {};
  return (
    <div className="groupModalInner">
      <div className="question">
        {showDeleteModal === true ? (
          <h3>Do you really want to delete {selectedChat?.chatName}</h3>
        ) : (
          <h3>
            Do you really want to remove {removeUserId.userName} from the group
          </h3>
        )}
      </div>
      <div className="modalButtons">
        {showDeleteModal === true ? (
          <button onClick={deleteGroupChatHandler}>Yes</button>
        ) : (
          <button onClick={removeUserHandler}>Yes</button>
        )}
        <button onClick={closeModal}>No</button>
      </div>
    </div>
  );
};

export default ConfirmChoiceModal;
