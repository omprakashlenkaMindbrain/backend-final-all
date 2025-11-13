import express from 'express'
import { plancontroller } from '../controller/plan.controller'
import { uploader } from '../../utils/upload'
import { requireUser } from '../../User/middlewares/requiredUser'


export const planrouter = express.Router()

planrouter.post('/plan',requireUser,uploader.fields([{ name: "payment_ss", maxCount: 1 },]),
    plancontroller
)