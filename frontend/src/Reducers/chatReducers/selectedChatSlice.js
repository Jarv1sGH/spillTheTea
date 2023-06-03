import { createSlice } from "@reduxjs/toolkit";
const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState: {
    selectedChat: null,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
  },
});

export const { setSelectedChat,clearSelectedChat } = selectedChatSlice.actions;

export default selectedChatSlice.reducer;
