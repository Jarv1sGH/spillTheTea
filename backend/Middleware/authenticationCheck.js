const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

 const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login to access this resource",
      });
    }

    //Verifying the JWT token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedData.id;
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      return res.status(401).json({
        success: false,
        error: "Token is Invalid",
      });
    }
    // user found in the DB
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {isAuthenticatedUser};
