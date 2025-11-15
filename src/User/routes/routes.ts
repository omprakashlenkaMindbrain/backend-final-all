import express from 'express';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "../controller/session.controller";
import { createUserHandler, updateUserHandler } from '../controller/user.controller';
import { requireUser } from "../middlewares/requiredUser";
import validateResorces from "../middlewares/validateResource";
import { createSessionSchema } from '../schema/session.schema';
import { createUserSchema } from "../schema/user.schema";
//import {refreshAccessTokenHandler} from '../controller/session.controller'

const userRouter = express.Router()

    userRouter.post('/api/users',validateResorces(createUserSchema),createUserHandler)
    userRouter.post('/api/sessions',validateResorces(createSessionSchema),createUserSessionHandler)
    userRouter.get('/api/sessions', requireUser ,getUserSessionsHandler);
    userRouter.put("/api/users/me", requireUser, updateUserHandler);
    userRouter.delete("/api/sessions", requireUser, deleteSessionHandler);
    // userRouter.get("/user/refreshtoken",refreshAccessTokenHandler)

    //change password
    

export default userRouter;
