import { NextFunction, Request, Response } from 'express';
import multer from "multer";
import { uploader } from "../utils/upload"; // your multer setup file

const uploadHandler = (req:Request, res:Response, next:NextFunction) => {
  uploader.fields([
    { name: "adhara_img", maxCount: 1 },
    { name: "pan_img", maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // File too large
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          msg: "File size too large! Max 1 MB per file.",
        });
      }
      // Other multer-related errors
      return res.status(400).json({
        success: false,
        msg: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // Non-multer errors
      return res.status(400).json({
        success: false,
        msg: err.message || "Unexpected upload error",
      });
    }

    // ✅ No errors, continue to controller
    next();
  });
};

export default uploadHandler;
