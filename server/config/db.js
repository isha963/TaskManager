import mongoose from 'mongoose'

try {
  const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log();
  };
} catch (err) {
  console.error("Database connection failed:", error.message);
  process.exit(1);
}
export default connectDB;