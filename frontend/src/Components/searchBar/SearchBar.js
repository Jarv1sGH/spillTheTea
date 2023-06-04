import React, { useRef, useState, useEffect } from "react";
import "./SearchBar.css";
import { useDispatch } from "react-redux";
import SearchResults from "./SearchResults";
import { searchUsers } from "../../Reducers/userReducers/searchSlice";
const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
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
    if (e.keyCode === 13) {
      searchUsersHandler(e);
    }
  };

  // to show the returned users from the search
  const searchResultsHandler = () => {
    setShowSearchResults(true);
  };

  const handleClickOutsideMenu = (event) => {
    // closes the search results  if clicked anywhere on screen besides the search results
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  }, []);

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
