import express from "express";
import { PORT } from "./config/env.js";
import taskRouter from "./routes/tasks.routes.js";

import connecToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.mw.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddleware);

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/auth", authRouter);
// console.log(app.get);
app.get("/", (req, res) => {
  res.send("Welcome to Todo API");
});

app.listen(PORT, async () => {
  //   window.alert("Todo API is running");
  console.log(`Todo API is running on http://localhost:${PORT}`);

  await connecToDatabase();
});

export default app;
