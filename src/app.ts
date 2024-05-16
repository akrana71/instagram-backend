import express from "express";
import globalErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

app.use(express.json());

app.get("/", (_req, res, _next) => {
  res.json({ message: "Welcome to instagram" });
});

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
