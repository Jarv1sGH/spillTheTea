import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { newChatCreator } from "../../Reducers/chatReducers/newChatSlice";
const SearchResults = (props) => {
  const { setShowSearchResults } = props;
  const dispatch = useDispatch();
  const { error, usersArr, loading } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.user);
  let userId = user?.user?._id;
  const [recipientId, setRecipientId] = useState("");
  const newChatHandler = (id) => {
    setRecipientId(id);
  };
  useEffect(() => {
    if (recipientId === "") {
      return;
    }
    dispatch(newChatCreator(recipientId));
    setShowSearchResults(false);
  }, [dispatch, recipientId, setShowSearchResults]);
  return (
    <div className="searchResults">
      {Object.keys(usersArr).length === 0 && error === null && (
        <div className="startTyping">
          <p>Use the search bar to search for your friends</p>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="resultsContainer">
          {usersArr?.users &&
            usersArr?.users
              ?.filter((user) => user._id !== userId)
              .map((user) => (
                <div
                  key={user._id}
                  onClick={() => newChatHandler(user._id)}
                  className="member resultUser"
                >
                  <img src={user?.profilePic?.url} alt="" />
                  <div>
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
              ))}
        </div>
      )}

      {error !== null && (
        <div className="notFound">
          <p>No user was found try using your friends email</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
