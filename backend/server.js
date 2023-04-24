const app = require("./app");
require("dotenv").config({ path: "backend/config/config.env" });
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

//Uncaught Exception Handling
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//Database connection
connectDatabase();

//cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unahandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
