import { Request, Response } from "express";
import { editQr, setQr } from '../services/qr.service';
import log from "../../utils/logger";
import { getqr } from "../services/qr.service";


export async function setQrHandler(req: Request, res: Response) {
 
  
    try {
      if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    

    // call service with the uploaded file
    const qr = await setQr(req.file);

    return res.status(201).json({
      message: "QR created successfully",
      qr,
    });
  
    } catch (error:any) {
      return res.status(400).json({
        success: false,
        message: "A QR code already exists. Please update it instead of uploading a new one.",
      });
     log.error(error.message)
    }
}


export async function  editQrHandler(req:Request, res:Response) {

    if(!req.file){
        return res.status(400).json({message:"File is requried for edit "});

    }

    const filter :any = {};

    const qr = await editQr(req.file);

       return res.status(201).json({
      message: "QR updated  successfully",
      qr,
    });

    
}


export const getQrComtroller = async(req:Request,res:Response)=>{
  try {
    const qr = await getqr()
    if(!qr || qr.length===0){
      return res.status(404).json({msg:"qr not fetch "})
    }
    return res.status(201).json({msg:"qr fetch sucessfully",qr})
  } catch (error) {
    return res.status(500).json(error)
  }
}