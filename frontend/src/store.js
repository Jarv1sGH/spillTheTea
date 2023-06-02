import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/userReducers/userSlice";
import forgotPasswordReducer from "./Reducers/userReducers/forgotPasswordSlice";
import updatePasswordReducer from "./Reducers/userReducers/updatePasswordSlice";
import searchSliceReducer from "./Reducers/userReducers/searchSlice";
import editProfileReducer from "./Reducers/userReducers/editProfileSlice";
import allChatsReducer from "./Reducers/chatReducers/allChatsSlice";
import messagesReducer from "./Reducers/chatReducers/fetchMessagesSlice";
import sendMessageReducer from "./Reducers/chatReducers/sendMessageSlice";
import newChatReducer from "./Reducers/chatReducers/newChatSlice";
import editGroupChatReducer from "./Reducers/chatReducers/editGroupChatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    updatePassword: updatePasswordReducer,
    editProfile: editProfileReducer,
    chats: allChatsReducer,
    messages: messagesReducer,
    chatData: sendMessageReducer,
    search: searchSliceReducer,
    newChat: newChatReducer,
    updatedGroupChat: editGroupChatReducer,
  },
});

export default store;
