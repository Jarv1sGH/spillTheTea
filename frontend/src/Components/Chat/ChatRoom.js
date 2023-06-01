import React, { useState, useRef, useEffect } from "react";
import "./ChatRoom.css";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "./../../Reducers/chatReducers/sendMessageSlice";
import Loader from "../Loader/Loader";
import { fetchMessages } from "../../Reducers/chatReducers/fetchMessagesSlice";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:4000";
let selectedChatCompare;
const ChatRoom = (props) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [messagesArr, setMessagesArr] = useState([]);
  const [socket, setSocket] = useState(null);
  const {
    avatar,
    chatName,
    selectedChat,
    setShowChatInfo,
    showChatInfo,
    notify,
  } = props;
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState({
    messageContent: "",
    chatId: selectedChat?._id,
  });
  const messageInputChange = (e) => {
    setMessage({
      ...message,
      messageContent: e.target.value,
      chatId: selectedChat?._id,
    });
  };

  // socket connection
  useEffect(
    () => {
      const socket = io(ENDPOINT);
      setSocket(socket);
      socket.emit("setup", user?.user);
    },
    // eslint-disable-next-line
    []
  );

  // join chat
  useEffect(() => {
    if (socket) {
      socket.emit("join chat", selectedChat?._id);
    }
  }, [selectedChat, socket]);

  // fetches all the messages in the chat
  useEffect(() => {
    dispatch(fetchMessages(selectedChat?._id));
    selectedChatCompare = selectedChat;
  }, [dispatch, selectedChat]);

  // assigning messages to messagesArr
  useEffect(() => {
    if (!loading && messages && Array.isArray(messages.messages)) {
      setMessagesArr([...messages.messages]);
    }
  }, [loading, messages]);

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (message.messageContent.trim() !== "") {
      dispatch(sendMessage(message))
        .then((action) => {
          const chatData = action.payload;
          setMessage({ messageContent: "", chatId: selectedChat?._id });
          inputRef.current.value = "";
          socket.emit("new message", chatData.message);
          setMessagesArr((prevMessages) => [...prevMessages, chatData.message]);
        })
        .catch((error) => {
          notify(error);
          console.log(error);
        });
    }
  };

  const handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      sendMessageHandler(e);
    }
  };

  const showChatInfoHandler = () => {
    setShowChatInfo(!showChatInfo);
  };

  // listens for new Messages
  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          notify(`new message from  ${newMessageReceived.sender.name}`);
        } else {
          setMessagesArr((prevMessages) => [
            ...prevMessages,
            newMessageReceived,
          ]);
        }
      });
    }
  }, [socket, notify]);

  return (
    <>
      <div>
        <div className="chatHeader">
          <img src={avatar} alt="error" className="friendAvatar" />
          <p>{chatName}</p>
          <i
            onClick={showChatInfoHandler}
            className="fa-solid fa-circle-info"
          ></i>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <ScrollableChat
            messagesArr={messagesArr}
            avatar={avatar}
            chatName={chatName}
            selectedChat={selectedChat}
          />
        )}

        <div className="sendMessageBox">
          <div className="sendMessageBoxInner">
            <input
              onChange={messageInputChange}
              type="text"
              name="message"
              placeholder="Type a message..."
              value={message.message}
              ref={inputRef}
              onKeyDown={handleEnterKey}
              disabled={loading ? true : false}
            />
            <p className="sendBtn" onClick={sendMessageHandler}>
              <i className="fa-solid fa-paper-plane"></i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
