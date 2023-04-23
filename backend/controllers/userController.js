const User = require("../models/userModel");
const sendToken = require("../utils/jsonWebToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//User Registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the email already exists" });
    }
    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });
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
    // Finding user in DB for given email and password
    const user = await User.findOne({ email }).select("+password");
    //If user is not found
    if (!user) {
      return res.status(401).json({ error: "Invalid Email Id or Password" });
    }
    //Checking Password
    const isPasswordMatched = await user.comparePassword(password);
    //if password doesn't match
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid Email Id or Password" });
    }

    //Logging In
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error });
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
    // saving the user after token generation
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const emailMessage = `You Requested to change your password. Here is the link to reset yur password  \n\n${resetPasswordUrl}\n
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
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Comparing expiring time here, The token expire time should be greater than the current time
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset password token is invalid or expired" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); //saving user after password change
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get user details(for logged in users only)
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user,
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
};
