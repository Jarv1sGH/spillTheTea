import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddUserModal.css";
import { toast } from "react-toastify";
import { searchUsers } from "../../Reducers/userReducers/searchSlice";
import { addUser } from "../../Reducers/chatReducers/editGroupChatSlice";
const AddUsersModal = ({ addUsersModal }) => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [addUserData, setAddUserData] = useState({
    chatId: selectedChat._id,
    userIds: [],
  });
  const { usersArr } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.user);
  const userId = user?.user?._id;

  const searchQueryHandler = (e) => {
    setSearchQuery(e.target.value);
  };
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

  const addToSelectedUsers = (user) => {
    // if the user is already in the group
    if (selectedChat?.users.find((u) => u._id === user._id)) {
      toast("User already in the group");
    } else if (selectedUsers.find((u) => u._id === user._id)) {
      toast("User already selected");
    } else {
      setSelectedUsers((prevArr) => [...prevArr, user]);
    }
  };

  const removeSelectedUser = (user) => {
    console.log(user);
    setSelectedUsers((prevArr) => prevArr.filter((u) => u._id !== user._id));
  };

  useEffect(() => {
    setAddUserData((prevData) => ({
      ...prevData,
      chatId: selectedChat._id,
      userIds: selectedUsers.map((user) => user._id),
    }));
  }, [selectedChat, selectedUsers]);

  const closeModal = () => {
    addUsersModal.current.close();
    setSelectedUsers([]);
  };

  const addUserToGroupHandler = () => {
    dispatch(addUser(addUserData)).then((action) => {
      const response = action.payload;
      toast(response.message);
      closeModal();
    });
  };

  return (
    <div className=" groupModalInner addModalInner">
      <i
        title="close"
        onClick={closeModal}
        className="fa-solid fa-xmark blueIcon"
      ></i>
      <div className="groupName">
        <h3>Add users to {selectedChat.chatName}</h3>
      </div>
      <div className="searchBarContainer">
        <div className="searchBarWrapper">
          <div className="textInputWrapper">
            <input
              placeholder="Enter your friends username or email"
              type="text"
              className="textInput"
              onChange={searchQueryHandler}
              name="search"
              onKeyDown={handleEnterKey}
              autoComplete="off"
            />
            <i
              onClick={searchUsersHandler}
              className="fa-solid fa-magnifying-glass"
            ></i>
          </div>
        </div>

        <div className="searchWrapper">
          <div className="resultingUsers">
            {usersArr.users &&
              usersArr.users
                .filter((user) => user._id !== userId)
                .map((user) => (
                  <div key={user._id} className="member">
                    <i
                      onClick={() => addToSelectedUsers(user)}
                      className="fa-solid fa-plus"
                    />
                    <img src={user.profilePic.url} alt="user" />
                    <div>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))}
          </div>
          <div className="selectedUsers">
            {selectedUsers &&
              selectedUsers.map((user) => (
                <div key={user?._id} className="member">
                  <i
                    onClick={() => removeSelectedUser(user)}
                    className="fa-solid fa-minus"
                  />
                  <img src={user?.profilePic?.url} alt="user" />
                  <div>
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
              ))}
            <button
              onClick={addUserToGroupHandler}
              disabled={selectedUsers.length === 0 ? true : false}
              className="addBtn"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;
