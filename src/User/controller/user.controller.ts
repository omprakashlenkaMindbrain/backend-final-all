import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import {UpdateUserInput} from '../schema/user.update.schema';
import { createUser, updateUser } from "../services/user.service";
import logger from "../../utils/logger";


//for creating user
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    logger.info(req.body);
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}


//for editing user
export async function updateUserHandler(
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) {
  try {
    const userId = res.locals.user._id; // assuming userId is stored in token middleware
    const updates = req.body;

    const updatedUser = await updateUser(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    logger.error("Error updating user:", error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
