import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from 'config';



export interface UserDocument extends mongoose.Document {
  email: string;
  mobno: string;
  name: string;
  password: string;
  memId: string;
  trackingId?: string | null;
  referralCount: number;
  leftLeg?: mongoose.Types.ObjectId | null;
  rightLeg?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}



const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    mobno: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },

    memId: { type: String, required: true, default: null },
    trackingId: { type: String, default: null }, 

    referralCount: { type: Number, default: 0 },

   
    leftLeg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rightLeg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);




userSchema.pre("save",async function hashPassword(next) {
    let user = this as UserDocument;

    if(!user.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hash(user.password,salt);

    user.password = hash;

    return next();
})


userSchema.methods.comparePassword = async function(candidatePassword:string):Promise<boolean> {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword,user.password).catch(e=>false);
    
}
const UserModel = mongoose.model("User",userSchema);
export default UserModel;