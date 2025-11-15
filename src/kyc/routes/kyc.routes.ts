import express from 'express';
import { requireUser } from '../../User/middlewares/requiredUser';
import uploadHandler from '../../utils/MulterErrorHandler';
import { updatekyc, uploadFile } from './../Controller/kyc.controller';



export const kycrouter = express.Router()

kycrouter.post(
  '/kyc/upload',
  requireUser,
  uploadHandler, // handles multer and errors
  uploadFile
);

kycrouter.put(
  '/kyc/update',
  requireUser,
  uploadHandler, // handles multer and errors
  updatekyc
);