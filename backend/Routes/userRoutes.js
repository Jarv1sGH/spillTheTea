const express = require("express");
const router = express.Router();
const {
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
  searchUser,
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../Middleware/authenticationCheck");

router.route("/register").post(registerUser);

router.route("/login").post(userLogin);

router.route("/logout").get(userLogout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, changePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/user/search").get(isAuthenticatedUser, searchUser);

module.exports = router;
