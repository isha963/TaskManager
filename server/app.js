import express from 'express'
import indexRoutes from "./routes/indexRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import aiRoutes from "./routes/aiRoutes.js";
import errorHandler from './middleware/errorMiddleware.js';
import cors from "cors";


const app = express();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskmanager-xctc.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);



app.use("/api/ai", aiRoutes);
app.use("/", indexRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", userRoutes);
app.use(errorHandler);
export default app;