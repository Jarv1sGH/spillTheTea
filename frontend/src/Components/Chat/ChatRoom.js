import React, { useState, useRef, useEffect } from "react";
import "./ChatRoom.css";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "./../../Reducers/chatReducers/sendMessageSlice";
import Loader from "../Loader/Loader";
import { fetchMessages } from "../../Reducers/chatReducers/fetchMessagesSlice";
import { fetchAllChats } from "../../Reducers/chatReducers/allChatsSlice";
import ScrollableChat from "./ScrollableChat";
import { setChatDetails } from "../../chatLogic";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { setSelectedChat } from "../../Reducers/chatReducers/selectedChatSlice";
const ENDPOINT = "http://localhost:4000";
let selectedChatCompare;
const ChatRoom = (props) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [messagesArr, setMessagesArr] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [socket, setSocket] = useState(null);
  const { setShowChatInfo, showChatInfo, setMobileChatRoom } = props;
  const { messages, loading } = useSelector((state) => state.messages);
  const { selectedChat } = useSelector((state) => state.selectedChat);
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
          toast(error);
          console.log(error);
        });
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler(e);
    }
  };

  const showChatInfoHandler = () => {
    setShowChatInfo(!showChatInfo);
  };

  const mobileScreenHandler = () => {
    setMobileChatRoom(false);
    dispatch(setSelectedChat(null));
    dispatch(fetchAllChats());
  };

  // listens for new Messages
  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageReceived) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          toast(`new message from  ${newMessageReceived.sender.name}`);
        } else {
          setMessagesArr((prevMessages) => [
            ...prevMessages,
            newMessageReceived,
          ]);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    const { chatName, avatar } = setChatDetails(selectedChat, user);
    setChatName(chatName);
    setAvatar(avatar);
  }, [selectedChat, user]);

  return (
    <>
      <div>
        <div className="chatHeader">
          <i
            onClick={mobileScreenHandler}
            className="fa-solid fa-arrow-left-long backArrow"
          ></i>
          <img src={avatar} alt="error" className="friendAvatar" />
          <p>{chatName}</p>
          <i
            title="Chat Info"
            onClick={showChatInfoHandler}
            className="fa-solid fa-bars"
          ></i>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <ScrollableChat messagesArr={messagesArr} chatName={chatName} />
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
