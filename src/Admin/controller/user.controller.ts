import { Request, Response } from "express";
import logger from "../../utils/logger";
import { createUser } from "../services/user.service";


//for creating user
export async function createAdminHandler(
  req: Request,
  res: Response
) {
  try {
    logger.info(req.body);
    const admin = await createUser(req.body);

    return res.status(201).json({
      success: true,
      data: admin,
      message: "Admin created successfully"
    });

  } catch (e: any) {
    logger.error(e);

    return res.status(e.statusCode || 400).json({
      success: false,
      message: e.message || "Something went wrong",
    });
  }
}






