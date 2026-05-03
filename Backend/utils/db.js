import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is missing in environment variables.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected...");
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Server will continue running. Retrying database connection in 10 seconds...");
    setTimeout(() => {
      connectDB();
    }, 10000);
    return false;
  }
};

export default connectDB;
