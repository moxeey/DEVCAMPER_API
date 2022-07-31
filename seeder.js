const fs=require("fs");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path: "./config/config.env"});

mongoose.connect(process.env.MONGO_URL);

const Bootcamp=require("./models/Bootcamp");
const Course=require("./models/Course");
const User=require("./models/User");
const Review=require("./models/Review");



// Bootcamp JSON
const bootcamps=JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`,"utf-8")
);
const courses=JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`,"utf-8")
);
const users=JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`,"utf-8")
);
const reviews=JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`,"utf-8")
);

const importData=async () => {
  try {
    await User.create(users);
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await Review.create(reviews);

    console.log("Data imported");
    process.exit();
  } catch(error) {
    console.log(error);
  }
};

const deleteData=async () => {
  try {
    await User.deleteMany();
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await Review.deleteMany();

    console.log("Data destroyed");
    process.exit();
  } catch(error) {
    console.log(error);
  }
};

const resetData=async () => {
  try {
    console.log('Deleting data...')
    await deleteData()
    console.log('Importing data...')
    await importData()
  } catch(error) {
    console.log(error)
  }
}
if(process.argv[2]==="-i") {
  importData();
} else if(process.argv[2]==="-d") {
  deleteData();
} else if(process.argv[2]==="-r") {
  resetData()
}
