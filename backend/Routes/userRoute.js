const express = require("express");
const router = express.Router();
const {
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetails
} = require("../controllers/userController");

const {isAuthenticatedUser} = require("./../Middleware/authenticationCheck");

router.route("/").post(registerUser);

router.route("/login").post(userLogin);

router.route("/logout").get(userLogout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

// router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// router.route("/me/update").put(isAuthenticatedUser, updateProfile);
module.exports = router;
