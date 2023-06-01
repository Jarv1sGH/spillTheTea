const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupIcon: {
      public_id: {
        type: String,
        required: true,
        default: "profilePics/groupIcon_gv7ks7",
      },
      url: {
        type: String,
        required: true,
        default:
          "https://res.cloudinary.com/dz8mx0clv/image/upload/v1685636865/profilePics/groupIcon_gv7ks7.jpg",
      },
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
