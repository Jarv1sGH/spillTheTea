const express = require("express");
const router = express.Router();
const {
  sendMessage,
  fetchChatMessages,
} = require("../controllers/messageController");

const { isAuthenticatedUser } = require("../Middleware/authenticationCheck");

router.route("/message").post(isAuthenticatedUser, sendMessage);
router.route("/message/:chatId").get(isAuthenticatedUser, fetchChatMessages);

module.exports = router;
