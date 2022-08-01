const express=require("express");
const dotenv=require("dotenv");
const cookieParser=require('cookie-parser')
const colors=require("colors");
const errorHandler=require("./middleware/error");
const morgan=require("morgan");
const fileupload=require("express-fileupload");
const path=require("path");
const mongoSanizer=require('express-mongo-sanitize')
const helmet=require('helmet')
const xss=require('xss-clean')
const rateLimit=require('express-rate-limit')
const cors=require('cors')
const hpp=require('hpp')

const connectDb=require("./config/db");

// Load dotenv files
dotenv.config({path: "./config/config.env"});

// Connect Database
connectDb();

// Route files
const bootcamps=require("./routes/bootcamps");
const courses=require("./routes/courses");
const auth=require('./routes/auth')
const users=require('./routes/users')
const reviews=require('./routes/reviews')


// Initialize app
const app=express();

//Dev logging middleware
if(process.env.NODE_ENV==="development") {
  app.use(morgan("dev"));
}

// Add server middlewares
app.use(express.json());
app.use(cookieParser())
// Sanitize data
app.use(mongoSanizer())
// Set secutiry headers
app.use(helmet())
// Prevent XSS attacks
app.use(xss())
// Rate Limiting
const limiter=rateLimit({
  windowMs: 10*60*1000, // 10 minutes 
  max: 100
})
app.use(limiter)
// Prevent http param pollution
app.use(hpp())
// Enable CORS
app.use(cors())
// file uploading
app.use(fileupload());
// set statics folder
app.use(express.static(path.join(__dirname,"public")));


// mount routes
app.use("/api/v1/bootcamps",bootcamps);
app.use("/api/v1/courses",courses);
app.use("/api/v1/auth",auth)
app.use("/api/v1/users",users)
app.use("/api/v1/reviews",reviews)

app.use(errorHandler);

const PORT=process.env.PORT||5000;
const server=app.listen(PORT,() =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection",(err,promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close the server and exit process
  server.close(() => process.exit(1));
});
