import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, fullname, password } = req.body;
  // Validation
  if (!email || !username || !fullname || !password) {
    const error = createHttpError(400, "All fields are required!");
    next(error);
  }
  // Finduser

  try {
    const findUser = await userModal.findOne({ email });
    const findUsername = await userModal.findOne({ username });
    if (findUser) {
      const error = createHttpError(
        400,
        "This email is already used for other account!"
      );
      return next(error);
    } else if (findUsername) {
      return next(createHttpError(400, "Username already taken"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while finding user email"));
  }

  // Hash password
  const hashPassowrd = await bcrypt.hash(password, 10);

  // Create user
  let newUser: User;
  try {
    newUser = await userModal.create({
      email,
      username,
      fullname,
      password: hashPassowrd,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while creating new user!"));
  }

  // Jwtwebtoken
  try {
    const token = sign({ sub: newUser._id }, config.secret as string, {
      expiresIn: "2d",
    });

    // Response
    res.json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while sign token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(500, "All fields are required!"));
  }
  try {
    const findUser = await userModal.findOne({ email });
    if (findUser) {
      const hashPassowrd = findUser?.password;
      const checkPasswod = bcrypt.compare(password, hashPassowrd);

      if (!checkPasswod) {
        return next(createHttpError(500, "Password didn't match"));
      } else {
        const token = sign({ sub: findUser._id }, config.secret as string, {
          expiresIn: "2d",
        });
        return res.json({ accessToken: token });
      }
    } else {
      return next(createHttpError(500, "User not found!"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while login"));
  }
};

const checkUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = await req.body;
  try {
    const checkUser = await userModal.findOne({ username });
    if (checkUser) {
      return next(createHttpError(404, "Username already taken!"));
    } else {
      return res.status(200).json({ message: "Username available" });
    }
  } catch (error) {
    return next(createHttpError(500, "Error while finding username!"));
  }
};

export { createUser, loginUser, checkUserName };
