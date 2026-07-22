import express from 'express'
import indexRoutes from "./routes/indexRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import errorHandler from './middleware/errorMiddleware.js';
import cors from "cors";


const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/", indexRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", userRoutes);
app.use(errorHandler);
export default app;