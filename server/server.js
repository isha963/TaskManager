import app from './app.js'
import dotenv from "dotenv";

const result = dotenv.config();

console.log("Dotenv error:", result.error);
console.log("PORT:", process.env.PORT);
const PORT = process.env.PORT||3000;
import connectDB from "./config/db.js";




const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();