const app = require("./app");
require("dotenv").config({ path: "backend/config/config.env" });
const connectDatabase = require("./config/database");

//Uncaught Exception Handling
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//Database connection
connectDatabase();

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
