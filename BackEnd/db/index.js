import mongoose from "mongoose";
 

const connectDB = async () => {
  try {
    const response = await mongoose.connect('mongodb+srv://samarali9027:TQVq5vXuEeGugU43@cluster0.84t1wgj.mongodb.net/mydb');
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`Mongodb connection error: ${error.message}`);
  }
};

export default connectDB;
