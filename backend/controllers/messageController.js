const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
// const { isValidObjectId } = require("mongoose");

//send messages
const sendMessage = async (req, res) => {
  try {
    const { messageContent, chatId } = req.body;
    const senderId = req.user._id;

    if (!messageContent || !chatId) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(400).json({ error: "chat with this id was not found" });
    }

    let newMessage = {
      sender: senderId,
      message: messageContent,
      chat: chatId,
    };
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//fetch all messages in a chat
const fetchChatMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    if (!messages) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  fetchChatMessages,
};
