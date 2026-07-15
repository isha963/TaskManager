import express from 'express'
import indexRoutes from "./routes/indexRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
const app = express();

app.use(express.json());

app.use("/", indexRoutes);
app.use("/tasks", taskRoutes);
export default app;