import express from 'express';
import { requireUser } from '../../User/middlewares/requiredUser';
import uploadHandler from '../../utils/MulterErrorHandler';
import { updatekyc, uploadFile } from './../Controller/kyc.controller';



export const kycrouter = express.Router()

kycrouter.post(
  '/api/kyc/upload',
  requireUser,
  uploadHandler, // handles multer and errors
  uploadFile
);

kycrouter.put(
  '/api/kyc/update',
  requireUser,
  uploadHandler, // handles multer and errors
  updatekyc
);