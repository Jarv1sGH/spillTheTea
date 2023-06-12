import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import ChatRoom from "./ChatRoom";
import "./Chats.css";
import { fetchAllChats } from "../../Reducers/chatReducers/allChatsSlice";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import ChatInfo from "./ChatInfo";
import Loader from "../Loader/Loader";
import SearchBar from "../searchBar/SearchBar";
import { toast } from "react-toastify";
import AddUsersModal from "../Modal/AddUsersModal";
import { setShowCreateModal } from "../../Reducers/chatReducers/showCreateModalSlice";

const Chats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [settingsActive, setSettingsActive] = useState(false);
  const [mobileChatRoom, setMobileChatRoom] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const { updatedGroupChat } = useSelector((state) => state.updatedGroupChat);
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const { newChat, error } = useSelector((state) => state.newChat);
  const { user, isAuthenticated, loading, message } = useSelector(
    (state) => state.user
  );
  const { deletionResponse } = useSelector((state) => state.deleteGroupChat);
  const { chats } = useSelector((state) => state.chats);
  const menuRef = useRef(null);
  const addUsersModalRef = useRef(null);

  // shows the settings menu
  const settingsHandler = (event) => {
    event.stopPropagation(); // stops the button click from propagating to the document
    setSettingsActive(!settingsActive);
  };
  //if clicked outside the settings menu, it goes away
  const handleClickOutsideMenu = (event) => {
    // closes the profile menu if clicked anywhere on screen besides the menu
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setSettingsActive(false);
    }
  };

  // listens for click outside the profile menu and closes it.
  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  }, []);

  useEffect(() => {
    if (loading === false)
      if (isAuthenticated === false) {
        navigate("/");
      }
  }, [isAuthenticated, loading, navigate]);

  const newChatRef = useRef(null);
  // fetches all the chats of the user
  useEffect(() => {
    dispatch(fetchAllChats());
    if (newChatRef.current !== newChat?.message) {
      if (newChat?.message) {
        toast(newChat?.message);
      }
    }
    newChatRef.current = newChat?.message;

    if (error) {
      toast(error);
    }
  }, [dispatch, newChat, error, updatedGroupChat, deletionResponse]);

  // to show toast
  const previousMessageRef = useRef(null);
  useEffect(() => {
    if (previousMessageRef.current !== message) {
      if (message) {
        toast(message);
      }
      previousMessageRef.current = message;
    }
  }, [message]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="chatsOuterContainer">
          <dialog
            ref={addUsersModalRef}
            className="groupChatModal addUserModal"
          >
            <AddUsersModal addUsersModalRef={addUsersModalRef} />
          </dialog>
          {
            <ProfileMenu
              settingsActive={settingsActive}
              setSettingsActive={setSettingsActive}
              innerRef={menuRef}
            />
          }
          <div className="chatsInnerWrapper">
            <div className="sideMenu">
              <i
                title="Click me"
                onClick={() => {
                  toast("Clickity Click");
                }}
                className="fa-regular fa-comment-dots"
              ></i>
              <div onClick={settingsHandler} className="myProfile">
                <img
                  title="my profile"
                  src={user?.user?.profilePic?.url}
                  alt="userProfile"
                />
              </div>
            </div>
            <div className="chatsInnerContainer">
              <div className="chatNames">
                <div>
                  <h1>Chats</h1>
                  <i
                    onClick={() => {
                      dispatch(setShowCreateModal(true));
                      addUsersModalRef.current.showModal();
                    }}
                    title="create group chat"
                    className="fa-solid fa-users"
                  ></i>
                </div>
                <SearchBar />
                <div className="chatNamesWrapper">
                  {chats.chats &&
                    chats.chats.map((item) => (
                      <div
                        className={
                          selectedChat?._id === item._id
                            ? "selected singleChatWrapper"
                            : "singleChatWrapper"
                        }
                        key={item._id}
                      >
                        <Chat
                          chat={item}
                          setShowChatRoom={setShowChatRoom}
                          setMobileChatRoom={setMobileChatRoom}
                        />
                      </div>
                    ))}
                </div>
                <div onClick={settingsHandler} className="myProfileMobile">
                  <img
                    title="my profile"  
                    src={user?.user?.profilePic?.url}
                    alt="userProfile"
                  />
                </div>
              </div>
              {showChatRoom ? (
                <div
                  className={
                    mobileChatRoom === true
                      ? "chatRoom mobileChatRoomOpen"
                      : "chatRoom mobileChatRoomClose "
                  }
                >
                  <ChatRoom
                    setShowChatInfo={setShowChatInfo}
                    showChatInfo={showChatInfo}
                    setMobileChatRoom={setMobileChatRoom}
                  />
                </div>
              ) : (
                <div className="startChatting ">
                  <h1>SpillTheTea</h1>
                  <p>
                    Search your friends using the search bar and start chatting
                    now.
                  </p>
                </div>
              )}

              {showChatRoom && (
                <ChatInfo
                  setShowChatRoom={setShowChatRoom}
                  setShowChatInfo={setShowChatInfo}
                  addUsersModalRef={addUsersModalRef}
                  showChatInfo={showChatInfo}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
