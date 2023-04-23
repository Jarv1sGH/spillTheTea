const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Middleware to parse incoming JSON requests
app.use(express.json());


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


//Route Imports
const user = require("./Routes/userRoute");

app.use("/api/v1", user);

// Error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
