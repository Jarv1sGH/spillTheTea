import { createSlice } from "@reduxjs/toolkit";
const showCreateModalSlice = createSlice({
  name: "showCreateModal",
  initialState: {
    showCreateModal: null,
  },
  reducers: {
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    }, 
    clearCreateModal: (state) => {
      state.showCreateModal = null;
    },
  },
});

export const { setShowCreateModal, clearCreateModal } =
showCreateModalSlice.actions;

export default showCreateModalSlice.reducer;
