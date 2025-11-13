import { Document } from 'mongoose'
import mongoose from 'mongoose'


export interface Ikyc extends Document{
    userid:mongoose.ObjectId,
    adhara_img:string,
    pan_img:string,
    status:string
    adminComment:string
    isActive:boolean
}

const kycSchema = new mongoose.Schema<Ikyc>({
    userid:{
        type:mongoose.Schema.ObjectId,  
        ref:"UserModel"
    },
    adhara_img:{
        type:String,
        required:true
    },
    pan_img:{
        type:String,
        required:true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive:{
      type:Boolean,
      default:true
    },
    adminComment: { type: String, default: "" },
  
},{timestamps:true})

const kycmodel=mongoose.model<Ikyc>("kycmodel",kycSchema)
export default kycmodel