import React from "react";
import { useSelector } from "react-redux";
const ScrollableChat = (props) => {
  const { user } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const { chatName, messagesArr } = props;
  return (
    <div className="chatRoomInner">
      {/* <div className="typingWrapper">
          <div className="typing">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          Typing...
        </div> */}

      {messagesArr?.length === 0 && (
        <p style={{ alignSelf: "center" }}>
          Send your first message to {chatName}
        </p>
      )}
      {messagesArr &&
        messagesArr
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map((message) => (
            <div key={message?._id}>
              {message?.sender?._id !== user?.user?._id && (
                <div
                  style={{ alignItems: "flex-start", marginLeft: "12px" }}
                  className="message"
                >
                  <div className="msgContent">
                    <p className="senderMessages">
                      {message?.message}
                      {selectedChat?.isGroupChat && (
                        <span id="senderUserName">{message.sender.name} </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              {message?.sender?._id === user?.user?._id && (
                <div className="message flexEnd">
                  <div className="msgContent flexEnd">
                    <p className="flexEnd userMessages">{message.message}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
    </div>
  );
};

export default ScrollableChat;
