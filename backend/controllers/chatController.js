const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

// creating a chat or fetching existing chat if it exists.
const createChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "UserId is invalid" });
    }
    // Check if the recipient ID is valid
    if (!isValidObjectId(recipientId)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }
    // Checking if the sender and the recipient are the same
    if (userId === recipientId) {
      return res
        .status(400)
        .json({ error: "You cannot create a chat with yourself" });
    }

    // Check if a chat between the two users already exists
    let existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: recipientId } } },
      ],
    })
      .populate("users")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (existingChat.length > 0) {
      // since there will always only be one chat b/w two users hence the 0th index in the array
      return res.status(200).json({ existingChat: existingChat[0] });
    }
    const chatData = {
      chatName: req.user.name,
      isGroupChat: false,
      users: [userId, recipientId],
    };
    const chat = await Chat.create(chatData);
    const fullChatData = await Chat.findOne({ _id: chat._id }).populate(
      "users"
    );
    return res.status(200).json(fullChatData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//fetching all chats of a user
const fetchUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ error: "UserId is invalid" });
    }
    let chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a group chat
const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users) {
      return res
        .status(400)
        .json({ error: "Please provide users to add to the group " });
    }
    if (!req.body.chatName) {
      return res.status(400).json({ error: "Please provide a group name " });
    }
    // parsing stringified user array from frontend
    let users = JSON.parse(req.body.users);
    // if users array has only one user beside the creator of the groupChat.
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);
    const groupChatData = await Chat.create({
      chatName: req.body.chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const groupChat = await Chat.findOne({ _id: groupChatData._id })
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    res.status(200).json({ success: true, groupChat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rename a group chat
const renameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    if (!chatName || !chatId) {
      return res.status(400).json({
        error: "please provide the new groupchat name and and group chat id",
      });
    }
    const groupChat = await Chat.findOne({ _id: chatId });
    //checking if group chat with the id exists or not
    if (!groupChat) {
      return res.status(400).json({
        error: "chat with provided ChatId was not found",
      });
    }
    //checking if the requesting user is the admin of the group chat
    if (req.user._id.toString() !== groupChat.groupAdmin.toString()) {
      return res
        .status(401)
        .json({ error: "Only admin can change group name" });
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true, //without this it just returns the old value
      }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!updatedGroupChat) {
      return res.status(400).json({ error: "chat not found" });
    }
    res.status(200).json({
      success: true,
      message: "Group name updated successfully",
      updatedGroupChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete group chat
const deleteGroupChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({
        error: "please provide  chat id",
      });
    }

    const groupChat = await Chat.findOne({ _id: chatId });
    //checking if group chat with the id exists or not
    if (!groupChat) {
      return res.status(400).json({
        error: "chat with provided ChatId was not found",
      });
    }
    //checking if the requesting user is the admin of the group chat
    if (req.user._id.toString() !== groupChat.groupAdmin.toString()) {
      return res.status(401).json({ error: "Only admin can delete the group" });
    }

    const deletedGroupChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedGroupChat) {
      return res.status(400).json({ error: "chat with the id was not found" });
    }
    res.status(200).json({
      success: true,
      message: "Group deleted succesfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add  user to the group
const addUserToGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({
        error: "please provide  chat id",
      });
    }
    if (!userId) {
      return res.status(400).json({
        error: "please provide userId of user to add to the group",
      });
    }
    const groupChat = await Chat.findOne({ _id: chatId });
    //checking if group chat with the id exists or not
    if (!groupChat) {
      return res.status(400).json({
        error: "chat with provided ChatId was not found",
      });
    }
    //checking if the requesting user is the admin of the group chat
    if (req.user._id.toString() !== groupChat.groupAdmin.toString()) {
      return res
        .status(401)
        .json({ error: "Only admin can add users to the group " });
    }

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        //$push adds an element to the array
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!addUser) {
      return res
        .status(400)
        .json({ error: "Chat with provided chatId was not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User added to the group successfully",
      addUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Removing a user from group
const removeUserFromGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({
        error: "please provide  chat id",
      });
    }
    if (!userId) {
      return res.status(400).json({
        error: "please provide userId of user to add to the group",
      });
    }

    const groupChat = await Chat.findOne({ _id: chatId });
    //checking if group chat with the id exists or not
    if (!groupChat) {
      return res.status(400).json({
        error: "chat with provided ChatId was not found",
      });
    }
    //checking if the requesting user is the admin of the group chat
    if (req.user._id.toString() !== groupChat.groupAdmin.toString()) {
      return res
        .status(401)
        .json({ error: "Only admin can add users to the group " });
    }

    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        //$pull removes an element from the array
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!removeUser) {
      return res
        .status(400)
        .json({ error: "Chat with provided chatId was not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User removed from the group successfully",
      removeUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createChat,
  fetchUserChats,
  createGroupChat,
  renameGroupChat,
  deleteGroupChat,
  addUserToGroup,
  removeUserFromGroup,
};
