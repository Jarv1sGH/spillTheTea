import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import ChatRoom from "./ChatRoom";
import "./Chats.css";
import { fetchAllChats } from "../../Reducers/chatReducers/allChatsSlice";
import OverlayMenu from "../ProfileMenu/OverlayMenu";
import ChatInfo from "./ChatInfo";
import Loader from "../Loader/Loader";
import { searchUsers } from "../../Reducers/userReducers/searchSlice";
import SearchResults from "./SearchResults";
import EditGroupModal from "../Modal/EditGroupModal";

const Chats = ({ notify }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [settingsActive, setSettingsActive] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { updatedGroupChat } = useSelector((state) => state.updatedGroupChat);
  const { newChat, reloadChatList, error } = useSelector(
    (state) => state.newChat
  );
  const { user, isAuthenticated, loading, message } = useSelector(
    (state) => state.user
  );
  const { chats } = useSelector((state) => state.chats);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

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
    // closes the search results  if clicked anywhere on screen besides the search results
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
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

  // fetches all the chats of the user
  useEffect(() => {
    dispatch(fetchAllChats());
    if (
      reloadChatList === true &&
      newChat.existingChat === undefined &&
      error === null
    ) {
      notify("New Chat Created");
    }
    if (newChat?.existingChat) {
      notify("A chat with user already exists ");
    }
  }, [dispatch, reloadChatList, newChat, notify, error, updatedGroupChat]);

  // sets the search query for searchUsers function
  const searchQueryHandler = (e) => {
    setSearchQuery(e.target.value);
  };

  // onClick function that dispatches searchUsers function
  const searchUsersHandler = (e) => {
    e.preventDefault();
    if (searchQuery === "") {
      return;
    }
    dispatch(searchUsers(searchQuery));
  };

  const handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      searchUsersHandler(e);
    }
  };

  // to show the returned users from the search
  const searchResultsHandler = () => {
    setShowSearchResults(true);
  };

  // to show toast
  const previousMessageRef = useRef(null);
  useEffect(() => {
    if (previousMessageRef.current !== message) {
      if (message) {
        notify(message);
      }
      previousMessageRef.current = message;
    }
  }, [notify, message]);

  const modalRef = useRef(null);
  // const modal = document.querySelector("[data-modal]");
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="chatsOuterContainer">
          {selectedChat && (
            <dialog ref={modalRef} className="groupChatModal" data-modal>
              <EditGroupModal
                modal={modalRef}
                selectedChat={selectedChat}
                notify={notify}
              />
              {/* <i className="fa-solid fa-xmark blueIcon"></i> */}
            </dialog>
          )}
          {
            <OverlayMenu
              notify={notify}
              settingsActive={settingsActive}
              innerRef={menuRef}
            />
          }
          <div className="chatsInnerWrapper">
            <div className="sideMenu">
              <i
                title="Click me"
                onClick={() => {
                  notify("Clickity Click");
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
                    title="create group chat"
                    className="fa-solid fa-pen-to-square"
                  ></i>
                </div>
                <div className="searchContainer" ref={searchRef}>
                  <div className="textInputWrapper">
                    <input
                      placeholder="Enter your friends username or email"
                      type="text"
                      className="textInput"
                      onChange={searchQueryHandler}
                      onClick={searchResultsHandler}
                      name="search"
                      onKeyDown={handleEnterKey}
                      autoComplete="off"
                    />
                    <i
                      onClick={searchUsersHandler}
                      className="fa-solid fa-magnifying-glass"
                    ></i>
                  </div>
                  {showSearchResults && (
                    <SearchResults
                      setShowSearchResults={setShowSearchResults}
                      notify={notify}
                    />
                  )}
                </div>
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
                          setSelectedChat={setSelectedChat}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {showChatRoom ? (
                <div
                  className={
                    showChatInfo
                      ? "chatRoom chatInfoActive"
                      : "chatRoom chatInfoInActive"
                  }
                >
                  <ChatRoom
                    selectedChat={selectedChat}
                    setShowChatInfo={setShowChatInfo}
                    showChatInfo={showChatInfo}
                    notify={notify}
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

              {showChatInfo && showChatRoom && (
                <ChatInfo
                  selectedChat={selectedChat}
                  setShowChatInfo={setShowChatInfo}
                  modal={modalRef}
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
