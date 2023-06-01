import React from "react";
import { useSelector } from "react-redux";
import "./Chat.css";
import { setChatDetails } from "../../chatLogic";

const Chat = (props) => {
  const { setShowChatRoom, chat, setAvatar, setChatName, setSelectedChat } =
    props;
  const { user } = useSelector((state) => state.user);
  const chatRoomActive = () => {
    setShowChatRoom(true);
    setSelectedChat(chat);
    const { chatName, avatar } = setChatDetails(chat, user);
    setChatName(chatName);
    setAvatar(avatar);
  };

  // this is for the chatName and icon of the all the individual chats.
  let singleChatName, singleChatAvatar;
  const { chatName, avatar } = setChatDetails(chat, user);
  singleChatName = chatName;
  singleChatAvatar = avatar;

  let lastMsgTime;
  let lastMsgTimeString = new Date(chat?.latestMessage?.updatedAt);
  const nowTime = new Date();
  // if date is same then shows the time
  if (nowTime.toDateString() === lastMsgTimeString.toDateString()) {
    lastMsgTime = lastMsgTimeString.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // else shows the date of the last message
  else {
    lastMsgTime = lastMsgTimeString.toLocaleDateString();
  }
  return (
    <div className={"chat"} onClick={chatRoomActive}>
      <div className="userImage">
        <img src={singleChatAvatar} alt="" />
      </div>
      <div className="chatInfo">
        <div>
          <p style={{ fontWeight: "bolder", fontSize: "16px" }}>
            {singleChatName?.slice(0, 10)}
            {singleChatName?.length > 10 && "..."}
          </p>
          <p>
            {chat?.latestMessage?.sender?._id === user?.user?._id
              ? "You: "
              : chat.isGroupChat && chat?.latestMessage?.sender?.name + ": "}

            {chat?.latestMessage?.message.slice(0, 20)}
            {chat?.latestMessage?.message.length > 20 && "..."}
          </p>
        </div>
        {lastMsgTime !== "Invalid Date" && (
          <div className="lastMsgTime">{lastMsgTime}</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
