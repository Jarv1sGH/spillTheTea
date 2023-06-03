import React, { useEffect, useState } from "react";
import "./EditGroupModal.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroupChat } from "../../Reducers/chatReducers/deleteGroupChatSlice";
const ConfirmChoiceModal = (props) => {
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const {
    choiceModal,
    showDeleteModal,
    removeUserId,
    setRemoveUserData,
    setShowChatRoom,
  } = props;

  const [deletionData, setDeletionData] = useState({
    chatId: selectedChat._id,
  });
  const dispatch = useDispatch();

  const closeModal = () => {
    choiceModal.current.close();
  };

  const removeUserHandler = () => {
    setRemoveUserData((prevRemoveData) => ({
      ...prevRemoveData,
      userId: removeUserId.userId,
    }));
  };
  const deleteGroupChatHandler = () => {
    dispatch(deleteGroupChat({ data: deletionData })).then((action) => {
      const response = action.payload;
      choiceModal.current.close();
      setShowChatRoom(false);
      toast(response.message);
    });
  };

  useEffect(() => {
    setDeletionData((prevData) => ({
      ...prevData,
      chatId: selectedChat._id,
    }));
  }, [selectedChat]);

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
