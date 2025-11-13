import { FilterQuery, UpdateQuery } from "mongoose";
import qrModel,{qrDocument } from "../models/qr.model";
import { uploadfile } from "../../utils/upload";
import { error } from "console";

export async function setQr(input :Express.Multer.File){

    try{

        let qr = await qrModel.find();
       
        if(qr.length>0){
            
            throw new Error("Qr is already set you could edit it ");
        }
        // upload file to Cloudinary
    const result = await uploadfile(input.buffer, "qr-documents");

    if(!result){
      throw new Error("Failed to upload to the cloudinary");
    }
    // save Cloudinary link in DB
    const res = await qrModel.create({
     qr:result.url
    });

    return res;

    }catch(e:any){

        throw new Error("Failed to set QR: " + e.message);

    }


}


export async function editQr(
  file?: Express.Multer.File,
){
  try {
    const updateData: any = { $set: {} };



    // If a new file is uploaded, push to Cloudinary and add link
    if (file) {
      const result = await uploadfile(file.buffer, "qr-documents")
      updateData.$set.qr = result?.url;
    }

    // Since only one QR exists, no filter needed — just update the first one
    const qr = await qrModel.findOneAndUpdate({}, updateData, { new: true });
    if (!qr) {
      throw new Error("No QR found to update");
    }

    return qr;
  } catch (error) {
    throw new Error("Failed to edit QR: " + (error as Error).message);
  }
}


export const getqr = async()=>{
 try {
  const qr = await qrModel.find()
 return qr
 } catch (error) {
   throw new Error("Failed get edit QR: " + (error as Error).message);
 }
}

