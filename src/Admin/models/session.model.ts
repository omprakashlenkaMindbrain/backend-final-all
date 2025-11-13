import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AdminDocument } from "./user.model";

//session interface
export interface AdminSessionDocument extends mongoose.Document {
  user: AdminDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSessionSchema = new mongoose.Schema<AdminSessionDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent:{type:String}
  },
  {
    timestamps: true,
  }
);

const AdminSessionModel = mongoose.model("AdminSession", AdminSessionSchema);
export default AdminSessionModel;
