const User = require("../models/userModel");
const sendToken = require("../utils/jsonWebToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const fs = require("fs");

//User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.files?.profilePic;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the email already exists" });
    }
    //If user does not provide a profile pic it creates one with the default one
    if (!file) {
      // Creating a new user with default profile pic
      const newUser = await User.create({
        name,
        email,
        password,
      });
      // If newUser was returned directly it was including the password field
      const user = await User.findById(newUser._id);
      return sendToken(user, 201, res);
    }

    //If user provides a profile pic it uploads it to cloudinary and creates a new user
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

    // Creating a new user
    const newUser = await User.create({
      name,
      email,
      password,
      profilePic: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    // If newUser was returned directly it was including the password field
    const user = await User.findById(newUser._id);
    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter Email & Password" });
    }
    // Finding user in DB for given email
    const doesUserExist = await User.findOne({ email }).select("+password");
    //If user is not found
    if (!doesUserExist) {
      return res.status(401).json({ error: "Invalid Email Id or Password" });
    }
    //Checking Password
    const isPasswordMatched = await doesUserExist.comparePassword(password);
    //if password doesn't match
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid Email Id or Password" });
    }

    // Returns the user without the password hash
    const user = await User.findById(doesUserExist._id);

    //Logging In
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Logout

const userLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();
    // saving the user after reset password token generation
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const emailMessage = `You Requested to change your password. Here is the link to reset your password  \n\n${resetPasswordUrl}\n
    If not requested by you then you can disregard this email`;

    try {
      await sendEmail({
        email: user.email,
        emailMessage,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    //creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //finding the user with the same token hash
    const existingUser = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Comparing expiring time here, The token expire time should be greater than the current time
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Reset password token is invalid or expired" });
    }

    existingUser.password = req.body.password;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpire = undefined;

    await existingUser.save(); //saving user after password change

    //returns the user without the password hash
    const user = await User.findById(existingUser._id);
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get user details(for logged in users only)
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password (for logged in users only)
const changePassword = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id).select("+password");
    const isPasswordCorrect = await existingUser.comparePassword(
      req.body.oldPassword
    );
    //If password doesn't match
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Old password entered is incorrect",
      });
    }

    if (req.body.oldPassword === req.body.newPassword) {
      return res.status(400).json({
        error: "New password cannot be same as the old password",
      });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }
    // saving new password
    existingUser.password = req.body.newPassword;
    await existingUser.save();

    //returns the user without the password hash
    const user = await User.findById(existingUser._id);
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update profile (only for logged in users)
const updateProfile = async (req, res) => {
  try {
    const { name, email, aboutMe } = req.body;
    const updatedUserData = {
      name,
      email,
      aboutMe,
    };

    // If user updates profile picture
    if (req?.files?.profilePic && req.files.profilePic.size > 0) {
      const user = await User.findById(req.user._id);

      const imageId = user.profilePic.public_id;

      await cloudinary.v2.uploader.destroy(imageId);
      const file = req.files.profilePic;
      if (!file) {
        return res.status(400).json({ error: "Please upload a profile pic" });
      }
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

      updatedUserData.profilePic = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    //finding the user and updating it
    await User.findByIdAndUpdate(req.user._id, updatedUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//search User
const searchUser = async (req, res) => {
  try {
    // `/user/search?search=jhon%20doe (%20 is space url-encoded)`
    const searchQuery = req.query.search;
    //if search Query is empty
    if (!searchQuery) {
      return res.status(400).json({ message: "Search keyword is required" });
    }

    // converting to case-insensitive regex.
    const searchKeyword = new RegExp(searchQuery, "i");

    const users = await User.find({
      // searches both fields for given keyword
      $or: [{ name: searchKeyword }, { email: searchKeyword }],
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No User found with the given name",
      });
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
  searchUser,
};
