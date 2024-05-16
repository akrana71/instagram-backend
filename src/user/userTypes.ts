import { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  password: string;
}
