import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddUserModal.css";
import { toast } from "react-toastify";
import { searchUsers } from "../../Reducers/userReducers/searchSlice";
import { addUser } from "../../Reducers/chatReducers/editGroupChatSlice";
import { setShowCreateModal } from "../../Reducers/chatReducers/showCreateModalSlice";
import { clearSearch } from "../../Reducers/userReducers/searchSlice";
import { groupChatCreator } from "../../Reducers/chatReducers/newChatSlice";
import Loader from "../Loader/Loader";
const AddUsersModal = ({ addUsersModalRef }) => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.selectedChat);
  const { showCreateModal } = useSelector((state) => state.showCreateModal);
  const { loading } = useSelector((state) => state.newChat);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [addUserData, setAddUserData] = useState({
    chatId: selectedChat?._id,
    userIds: [],
  });
  const [formData, setFormData] = useState({
    chatName: "",
    users: [],
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
    if (
      showCreateModal === false &&
      selectedChat?.users.find((u) => u._id === user._id)
    ) {
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

  const formInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setAddUserData((prevData) => ({
      ...prevData,
      chatId: selectedChat?._id,
      userIds: selectedUsers.map((user) => user._id),
    }));
    setFormData((prevData) => ({
      ...prevData,
      users: selectedUsers.map((user) => user._id),
    }));
  }, [selectedChat, selectedUsers]);

  useEffect(() => {
    const userIds = selectedUsers.map((user) => user._id);
    setFormData((prevData) => ({
      ...prevData,
      users: JSON.stringify(userIds),
    }));
  }, [selectedUsers]);

  //If user update profile pic
  const fileInputRef = useRef();
  const handleFileInputChange = () => {
    const groupIconImg = fileInputRef.current.files[0];
    setFormData({
      ...formData,
      groupIcon: groupIconImg,
    });
  };

  const closeModal = () => {
    addUsersModalRef.current.close();
    setSelectedUsers([]);
    dispatch(setShowCreateModal(false));
    dispatch(clearSearch());
  };

  const addUserToGroupHandler = () => {
    dispatch(addUser(addUserData)).then((action) => {
      const response = action.payload;
      toast(response.message);
      closeModal();
    });
  };
  const createGroupChatHandler = (e) => {
    e.preventDefault();
    if (JSON.parse(formData.users).length < 2) {
      toast("Please add atleast 2 users");
      return;
    }
    console.log(formData);
    dispatch(groupChatCreator(formData)).then(() => {
      closeModal();
    });
  };

  return (
    <>
      {loading ? (
        <div className=" groupModalInner addModalInner">
          <Loader />
        </div>
      ) : (
        <div className=" groupModalInner addModalInner">
          <i
            title="close"
            onClick={closeModal}
            className="fa-solid fa-xmark blueIcon"
          ></i>
          <div className="groupName">
            {showCreateModal === true ? (
              <h3>Create Group</h3>
            ) : (
              <h3>Add users to {selectedChat?.chatName}</h3>
            )}
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
                <h3 className="textAlign">Search Results</h3>
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
                {showCreateModal && (
                  <div>
                    <form
                      className="createGroupForm"
                      onSubmit={createGroupChatHandler}
                    >
                      <input
                        className="input"
                        name="chatName"
                        type="text"
                        placeholder="Enter Group Chat Name*"
                        required
                        value={formData.chatName}
                        onChange={formInputChange}
                        autoComplete="off"
                      />
                      <input
                        className="input"
                        name="groupIcon"
                        type="file"
                        ref={fileInputRef}
                        placeholder="Enter Group Chat Name"
                        onChange={handleFileInputChange}
                        autoComplete="off"
                      />
                      {showCreateModal === true && (
                        <button
                          disabled={selectedUsers.length === 0 ? true : false}
                          type="submit"
                          className="addBtn"
                        >
                          Create
                        </button>
                      )}
                    </form>
                  </div>
                )}
                <h3 className="textAlign">Selected Users</h3>
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
                      </div>
                    </div>
                  ))}
                {showCreateModal === false && (
                  <button
                    onClick={addUserToGroupHandler}
                    disabled={selectedUsers.length === 0 ? true : false}
                    className="addBtn"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUsersModal;
