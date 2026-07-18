import express from 'express'
import indexRoutes from "./routes/indexRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"


const app = express();

app.use(express.json());

app.use("/", indexRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;