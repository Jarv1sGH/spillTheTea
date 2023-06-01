import React from "react";
import "./ChatInfo.css";
import { useSelector } from "react-redux";
const ChatInfo = (props) => {
  const { user } = useSelector((state) => state.user);
  const { selectedChat, avatar, chatName, setShowChatInfo } = props;
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

  let isUserGroupAdmin = false;
  if (selectedChat?.isGroupChat) {
    if (user?.user?._id === selectedChat?.groupAdmin?._id) {
      isUserGroupAdmin = true;
    }
  }
  return (
    <div className="chatInfoContainer">
      <i onClick={closeChatInfoHandler} className="fa-solid fa-xmark"></i>
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
                <i className="fa-solid fa-envelope"></i> Email
              </p>
              <h3>{chatUserEmail}</h3>
            </div>
            <div className="idkWhatToNameThisDiv">
              <p>
                <i className="fa-solid fa-address-card"></i> About
              </p>
              <h3>{chatUserAbout}</h3>
            </div>
          </>
        ) : (
          <div className="groupChatInfo">
            <div className="chatName">
              <h2>{chatName}</h2>
            </div>
            <div className="groupChatMembers">
              <p>
                Members <i className="fa-solid fa-users"></i>
              </p>
              {selectedChat?.users &&
                selectedChat?.users.map((user) => (
                  <div key={user?._id} className="member">
                    <img src={user?.profilePic?.url} alt="" />
                    <div>
                      <p>{user?.name}</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInfo;
