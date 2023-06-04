import { createSlice } from "@reduxjs/toolkit";
const showSearchResultsSlice = createSlice({
  name: "showSearchResults",
  initialState: {
    showSearchResults: false,
  },
  reducers: {
    setShowSearchResults: (state, action) => {
      state.showSearchResults = action.payload;
    },
    clearShowSearchResults: (state) => {
      state.showSearchResults = false;
    },
  },
});

export const { setShowSearchResults, ShowSearchResults } =
  showSearchResultsSlice.actions;

export default showSearchResultsSlice.reducer;
