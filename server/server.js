

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

;
console.log("PORT:", process.env.PORT);
const PORT = process.env.PORT||3000;





const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();