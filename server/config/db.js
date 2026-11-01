

import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";

const connectDB = async () => {
    

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    
  
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}
export default connectDB;