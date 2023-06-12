import { createSlice } from "@reduxjs/toolkit";
const showCreateModalSlice = createSlice({
  name: "showCreateModal",
  initialState: {
    showCreateModal: false,
  },
  reducers: {
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    },
    clearCreateModal: (state) => {
      state.showCreateModal = false;
    },
  },
});

export const { setShowCreateModal, clearCreateModal } =
  showCreateModalSlice.actions;

export default showCreateModalSlice.reducer;
