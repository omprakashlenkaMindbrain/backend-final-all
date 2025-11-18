import express from 'express'
import { requireUser } from '../../User/middlewares/requiredUser'
import { uploader } from '../../utils/upload'
import { plancontroller } from '../controller/plan.controller'


export const planrouter = express.Router()

planrouter.post('/api/plan',requireUser,uploader.fields([{ name: "payment_ss", maxCount: 1 },]),
    plancontroller
)