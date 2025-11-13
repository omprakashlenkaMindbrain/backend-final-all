
import mongoose from "mongoose";


interface Iplan {
  userId:mongoose.ObjectId
  plan_name: "gold" | "silver" | "premium" | "platinum";
  payment_ss:string
}


const planSchema = new mongoose.Schema<Iplan>({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"UserModel"
    },
    plan_name:{
        type:String,
        required:true,
        enum: ["gold", "silver", "premium", "platinum"],
    },
    payment_ss:{
        type:String,
    }
},{timestamps:true})

export const planmodel = mongoose.model<Iplan>("plan",planSchema)


