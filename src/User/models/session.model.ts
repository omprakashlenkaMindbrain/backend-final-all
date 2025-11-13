import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import e from "express";
import { UserDocument } from "./user.model";

//session interface
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema<SessionDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent:{type:String}
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model("Session", SessionSchema);
export default SessionModel;
