import mongoose from "mongoose";


interface Iadminplan {
  plan_name: "gold" | "silver" | "premium" | "platinum";
  plan_price:number
}


const planSchema = new mongoose.Schema<Iadminplan>({
    plan_name:{
        type:String,
        required:true,
        enum: ["gold", "silver", "premium", "platinum"],
    },
    plan_price:{
        type:Number,
}
})

export const adminplanmodel = mongoose.model<Iadminplan>("plan",planSchema)


