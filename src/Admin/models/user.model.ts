import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from 'config';
import e from "express";

//user interface
export interface AdminDocument extends mongoose.Document{
    email:string,
    qrcode:string
    mobno:string,
    name:string,
    password:string,
    createdAt:Date, 
    updatedAt:Date,

    comparePassword(candidatePassword:string):Promise<boolean>

}
const adminSchema = new mongoose.Schema<AdminDocument>({
    email:{type:String,required:true,unique:true},
    mobno:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
   // qrcode:{type:String,required:true}
},{
    timestamps:true
})

adminSchema.pre("save",async function hashPassword(next) {
    let user = this as AdminDocument;

    if(!user.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hash(user.password,salt);

    user.password = hash;

    return next();
})


adminSchema.methods.comparePassword = async function(candidatePassword:string):Promise<boolean> {
    const user = this as AdminDocument;
    return bcrypt.compare(candidatePassword,user.password).catch(e=>false);
    
}
const AdminModel = mongoose.model("Admin",adminSchema);
export default AdminModel;