import { uploadFile } from './../Controller/kyc.controller';
import express from 'express'
import { uploader } from '../../utils/upload'
import { requireUser } from '../../User/middlewares/requiredUser';
import { updatekyc } from './../Controller/kyc.controller';

export const kycrouter = express.Router()

kycrouter.post('/kyc/upload',requireUser,uploader.fields([{ name: "adhara_img", maxCount: 1 },
    { name: "pan_img", maxCount: 1 },]),
    uploadFile
)

kycrouter.put("/kyc/update",requireUser,uploader.fields([{ name: "adhara_img", maxCount: 1 },
    { name: "pan_img", maxCount: 1 },]),updatekyc)