import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { verifyJwt } from "../../utils/jwt.utils";
import { findSessions } from "../services/session.service";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send({ message: "No token provided" });

  const { decode, expired } = verifyJwt<{ session: string }>(token);

  if (!decode) {
    return res.status(401).send({ message: expired ? "Token expired" : "Invalid token" });
  }

  // checking for valid session or if the session is destroyed
  const sessions = await findSessions({
    _id: new mongoose.Types.ObjectId(decode.session),
    valid: true,
  });

  if (!sessions || sessions.length === 0) {
    return res.status(401).send({ message: "Session expired" });
  }

  res.locals.user = decode;

  next();
}
