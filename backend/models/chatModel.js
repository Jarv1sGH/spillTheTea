const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  chat: {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
      required: true,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
}, {
    timestamps:true
});

module.exports = mongoose.model("Chat", chatSchema);
