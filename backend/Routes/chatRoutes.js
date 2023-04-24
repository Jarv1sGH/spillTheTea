const express = require("express");
const router = express.Router();
const {
  createChat,
  fetchUserChats,
    createGroupChat,
    renameGroupChat,
    deleteGroupChat,
    addUserToGroup,
    removeUserFromGroup
} = require("../controllers/chatController");

const { isAuthenticatedUser } = require("../Middleware/authenticationCheck");

router.route("/chat").post(isAuthenticatedUser, createChat);
router.route("/chats").get(isAuthenticatedUser, fetchUserChats);
router.route("/chat/group").post(isAuthenticatedUser, createGroupChat);
router.route("/chat/group/rename").put(isAuthenticatedUser, renameGroupChat);
router.route("/chat/group/delete").delete(isAuthenticatedUser, deleteGroupChat);
router.route("/chat/group/add").put(isAuthenticatedUser, addUserToGroup);
router.route("/chat/group/remove").put(isAuthenticatedUser, removeUserFromGroup);

module.exports = router;
