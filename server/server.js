import app from './app.js'
import dotenv from "dotenv";
const PORT = process.env.PORT||3000;
import connectDB from "./config/db.js";


dotenv.config();

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();