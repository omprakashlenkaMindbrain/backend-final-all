import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateAdminInput } from "../schema/admin.schema";
import { createUser } from "../services/user.service";
import logger from "../../utils/logger";


//for creating user
export async function createAdminHandler(
  req: Request<{}, {}, CreateAdminInput>,
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






