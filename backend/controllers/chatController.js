const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("cloudinary");
const fs = require("fs");

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
      select: "name email aboutMe",
    });

    if (existingChat.length > 0) {
      // since there will always only be one chat b/w two users hence the 0th index in the array
      return res.status(200).json({
        existingChat: existingChat[0],
        message: "A chat with user already exists",
      });
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
    return res.status(200).json({ fullChatData, message: "New chat created!" });
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
      select: "name email aboutMe",
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
    const file = req.files?.groupIcon;
    // if users array has only one user beside the creator of the groupChat.
    if (!Array.isArray(users) || users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);

    // if a group Icon is not provided in the req , group is created with the default icon
    if (!file) {
      const groupChatData = await Chat.create({
        chatName: req.body.chatName,
        users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const groupChat = await Chat.findOne({ _id: groupChatData._id })
        .populate("users", "-resetPasswordToken -resetPasswordExpire")
        .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

      return res
        .status(200)
        .json({ success: true, message: "Group Chat Created", groupChat });
    }

    //creating Group chat with icon
    const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "profilePics",
      width: 150,
      crop: "scale",
    });

    // deleting the temporary file
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Temporary file deleted");
    });
    const groupChatData = await Chat.create({
      chatName: req.body.chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
      groupIcon: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    const groupChat = await Chat.findOne({ _id: groupChatData._id })
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");
    res
      .status(200)
      .json({ success: true, message: "Group Chat Created", groupChat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a group chat
const updateGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedGroupChatData = {
      chatName,
    };
    if (!chatId) {
      return res.status(400).json({
        error: "please provide the chat id",
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

    // if the request contains image file to update groupIcon
    if (req?.files?.groupIcon && req.files.groupIcon.size > 0) {
      const imageId = groupChat.groupIcon.public_id;
      if (imageId !== "profilePics/groupIcon_gv7ks7") {
        await cloudinary.v2.uploader.destroy(imageId);
      }
      const file = req.files.groupIcon;
      const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "profilePics",
        width: 150,
        crop: "scale",
      });
      // deleting the temporary file
      fs.unlink(file.tempFilePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Temporary file deleted");
      });
      updatedGroupChatData.groupIcon = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      updatedGroupChatData,

      {
        new: true, //without this it just returns the old value
        runValidators: true,
        useFindAndModify: false,
      }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!updatedGroupChat) {
      return res.status(400).json({ error: "chat not found" });
    }
    res.status(200).json({
      success: true,
      message: "Group updated successfully",
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
    const imageId = groupChat.groupIcon.public_id;
    // if the groupIcon is not the default one
    if (imageId !== "profilePics/groupIcon_gv7ks7") {
      await cloudinary.v2.uploader.destroy(imageId);
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
    const { userIds, chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({
        error: "please provide chat id",
      });
    }
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: "please provide an array of userIds to add to the group",
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

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        // $addToSet adds elements to the array only if they are not already present
        $addToSet: { users: { $each: userIds } },
        // $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!updatedGroupChat) {
      return res
        .status(400)
        .json({ error: "Chat with provided chatId was not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Users added to the group successfully",
      updatedGroupChat,
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
        .json({ error: "Only admin can remove users from the group " });
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        //$pull removes an element from the array
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-resetPasswordToken -resetPasswordExpire")
      .populate("groupAdmin", "-resetPasswordToken -resetPasswordExpire");

    if (!updatedGroupChat) {
      return res
        .status(400)
        .json({ error: "Chat with provided chatId was not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User removed from the group successfully",
      updatedGroupChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createChat,
  fetchUserChats,
  createGroupChat,
  updateGroupChat,
  deleteGroupChat,
  addUserToGroup,
  removeUserFromGroup,
};
