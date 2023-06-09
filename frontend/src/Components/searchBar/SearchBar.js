import React, { useRef, useState, useEffect } from "react";
import "./SearchBar.css";
import { useDispatch, useSelector } from "react-redux";
import SearchResults from "./SearchResults";
import { searchUsers } from "../../Reducers/userReducers/searchSlice";
import { setShowSearchResults } from "../../Reducers/chatReducers/showSearchResultsSlice";
const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { showSearchResults } = useSelector((state) => state.showSearchResults);
  const searchRef = useRef(null);
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
    if (e.key === "Enter") {
      searchUsersHandler(e);
    }
  };

  // to show the returned users from the search
  const searchResultsHandler = () => {
    dispatch(setShowSearchResults(true));
  };

  const handleClickOutsideMenu = (event) => {
    // closes the search results  if clicked anywhere on screen besides the search results
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      dispatch(setShowSearchResults(false));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  });

  return (
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
        <SearchResults setShowSearchResults={setShowSearchResults} />
      )}
    </div>
  );
};

export default SearchBar;
