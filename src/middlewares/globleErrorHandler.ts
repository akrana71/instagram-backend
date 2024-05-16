import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err,
    status: statusCode,
    errorStack: config.nodeEnv === "DEVELOPMENT" ? err.stack : "",
  });
};

export default globalErrorHandler;
