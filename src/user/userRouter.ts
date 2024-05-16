import express from "express";
import { createUser, loginUser, checkUserName } from "./userController";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/checkusername", checkUserName);

export default userRouter;
