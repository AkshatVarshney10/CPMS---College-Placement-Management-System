const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
  console.error(error);
  process.exit(1);
}
};

module.exports = connectDB;