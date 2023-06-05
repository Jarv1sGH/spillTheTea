import React, { useState, useEffect, useRef } from "react";
import "./ChatInfo.css";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setChatDetails } from "../../chatLogic";
import { removeUser } from "../../Reducers/chatReducers/editGroupChatSlice";
import ConfirmChoiceModal from "../Modal/ConfirmChoiceModal";
import EditGroupModal from "../Modal/EditGroupModal";
import { leaveGroupChat } from "../../Reducers/chatReducers/deleteGroupChatSlice";
const ChatInfo = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { setShowChatInfo, setShowChatRoom, addUsersModalRef } = props;
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const [avatar, setAvatar] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [isUserGroupAdmin, setIsUserGroupAdmin] = useState(false);

  const [removeUserId, setRemoveUserId] = useState({
    userName: "",
    userId: "",
  });
  const modalRef = useRef(null);
  const choiceModalRef = useRef(null);
  // const addUsersModalRef = useRef(null);

  const [removeUserData, setRemoveUserData] = useState({
    chatId: selectedChat?._id,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loggedInUserId = user?.user?._id;
  let chatUserEmail, chatUserAbout;
  if (user?.user?.email === selectedChat?.users?.[0]?.email) {
    chatUserEmail = selectedChat?.users?.[1]?.email;
    chatUserAbout = selectedChat?.users?.[1]?.aboutMe;
  } else {
    chatUserEmail = selectedChat?.users?.[0]?.email;
    chatUserAbout = selectedChat?.users?.[0]?.aboutMe;
  }
  const closeChatInfoHandler = () => {
    setShowChatInfo(false);
  };

  // let isUserGroupAdmin = false;

  useEffect(() => {
    if (selectedChat?.isGroupChat) {
      if (loggedInUserId === selectedChat?.groupAdmin?._id) {
        setIsUserGroupAdmin(true);
      }
    }
  }, [selectedChat, loggedInUserId]);

  const showModal = () => {
    modalRef.current.showModal();
  };

  const showChoiceModal = () => {
    choiceModalRef.current.showModal();
    setShowDeleteModal(true);
  };

  // updates the chat details every time selectedChat changes
  useEffect(() => {
    const { chatName, avatar } = setChatDetails(selectedChat, user);
    setChatName(chatName);
    setAvatar(avatar);
  }, [selectedChat, user]);

  const removeUserHandler = (user) => {
    setShowDeleteModal(false);
    setRemoveUserId((prevData) => ({
      ...prevData,
      userName: user.name,
      userId: user._id,
    }));
    choiceModalRef.current.showModal();
  };

  const addUsersHandler = () => {
    addUsersModalRef.current.showModal();
  };

  useEffect(() => {
    if (removeUserData.userId === undefined) {
      return;
    }
    // to remove user and then show toast
    dispatch(removeUser(removeUserData)).then((action) => {
      const updatedData = action.payload;
      if (updatedData.success === true) {
        toast(updatedData.message);
        choiceModalRef.current.close();
      }
    });
  }, [removeUserData, dispatch]);

  const leaveGroupHandler = () => {
    dispatch(leaveGroupChat(selectedChat._id)).then((action) => {
      const response = action.payload;
      setShowChatRoom(false);
      toast(response.message);
    });
  };
  return (
    <div className="chatInfoContainer">
      {selectedChat && (
        <dialog ref={modalRef} className="groupChatModal">
          <EditGroupModal modalRef={modalRef} />
        </dialog>
      )}
      {selectedChat && (
        <dialog ref={choiceModalRef} className="confirmChoiceModal">
          <ConfirmChoiceModal
            choiceModal={choiceModalRef}
            showDeleteModal={showDeleteModal}
            setRemoveUserData={setRemoveUserData}
            removeUserId={removeUserId}
            setShowChatRoom={setShowChatRoom}
          />
        </dialog>
      )}
      <i
        title="close"
        onClick={closeChatInfoHandler}
        className="fa-solid fa-xmark"
      ></i>
      <div className="chatUserInfo">
        <div className="chatIcon">
          <img src={avatar} alt="" />
        </div>
        {selectedChat?.isGroupChat === false ? (
          <>
            <div className="chatName">
              <h2>{chatName}</h2>
            </div>
            <div className="idkWhatToNameThisDiv">
              <p>
                <i className="fa-solid fa-envelope blueIcon"></i> Email
              </p>
              <h3>{chatUserEmail}</h3>
            </div>
            <div className="idkWhatToNameThisDiv">
              <p>
                <i className="fa-solid fa-address-card blueIcon"></i> About
              </p>
              <h3>{chatUserAbout}</h3>
            </div>
          </>
        ) : (
          <div className="groupChatInfo">
            <div className="chatName">
              <h2>{chatName} </h2>
            </div>
            <div className="groupChatMembers">
              <p>
                Members <i className="fa-solid fa-users blueIcon"></i>
              </p>
              {selectedChat?.users &&
                selectedChat?.users.map((user) => (
                  <div key={user?._id} className="member">
                    {isUserGroupAdmin === true &&
                      selectedChat?.groupAdmin?._id !== user._id && (
                        <i
                          onClick={() => removeUserHandler(user)}
                          title="kick user "
                          className="fa-solid fa-person-walking-arrow-right"
                        ></i>
                      )}
                    <img src={user?.profilePic?.url} alt="user" />
                    <div>
                      <p>
                        {user?.name}{" "}
                        {selectedChat?.groupAdmin?._id === user?._id && (
                          <span id="admin">admin</span>
                        )}
                      </p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                ))}
              <p>
                <i
                  onClick={addUsersHandler}
                  title="Add users to group"
                  style={{ fontSize: "25px" }}
                  className="fa-solid fa-circle-plus "
                ></i>
              </p>
            </div>
            {isUserGroupAdmin === true ? (
              <div className="groupButtons">
                <button onClick={showModal}>Edit Group</button>
                <button onClick={showChoiceModal}>delete Group</button>
              </div>
            ) : (
              <button onClick={leaveGroupHandler}>Leave Group</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInfo;
