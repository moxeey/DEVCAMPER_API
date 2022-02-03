const mongoose = require("mongoose");

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);

  console.log(`Database Connected: ${conn.connection.host}`.cyan.underline);
};

module.exports = connectDb;
