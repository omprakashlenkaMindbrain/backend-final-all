import mongoose,{Document} from "mongoose";

const Schema = mongoose.Schema;


export interface qrDocument extends Document{
    qr?:string,
    createdAt:Date,
    updatedAt:Date
}

const qrSchema = new Schema(
  {
    qr: {
      type: String,
      required: true,
      unique:true
    },
  },
  {
    timestamps: true,
  }
);


 const qrModel = mongoose.model<qrDocument>("Qr",qrSchema)

 export default qrModel;
