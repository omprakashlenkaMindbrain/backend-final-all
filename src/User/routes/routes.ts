import {  Request,Response } from "express";
import express from 'express'
import {createUserHandler, updateUserHandler} from '../controller/user.controller'
import validateResorces from "../middlewares/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { createUserSessionHandler, getUserSessionsHandler, deleteSessionHandler } from "../controller/session.controller";
import {createSessionSchema} from '../schema/session.schema'
import {requireUser} from "../middlewares/requiredUser";
//import {refreshAccessTokenHandler} from '../controller/session.controller'

const userRouter = express.Router()

    userRouter.post('/api/users',validateResorces(createUserSchema),createUserHandler)
    userRouter.post('/api/sessions',validateResorces(createSessionSchema),createUserSessionHandler)
    userRouter.get('/api/sessions', requireUser ,getUserSessionsHandler);
    userRouter.put("/api/users/me", requireUser, updateUserHandler);
    userRouter.delete("/api/sessions", requireUser, deleteSessionHandler);
    //userRouter.get("/user/refreshtoken",refreshAccessTokenHandler)

    //change password
    

export default userRouter;
