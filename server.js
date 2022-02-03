const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDb = require("./config/db");

// Load dotenv files
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDb();

// Route files
const bootcamps = require("./routes/bootcamps");

// Initialize app
const app = express();

// Add body parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close the server and exit process
  server.close(() => process.exit(1));
});
