// import { DocumentDefinition } from "mongoose";
import { FilterQuery } from "mongoose";
import UserModel, { AdminDocument } from "../models/user.model";
import { omit } from "lodash";
import {CreateAdminInput} from '../schema/admin.schema'
import AdminModel from "../models/user.model";
import { uploadfile } from "../../utils/upload";


export async function createUser(  input: CreateAdminInput
  ){
  try{

    const emailExists = await AdminModel.findOne({ email: input.email });
    if (emailExists) {
      throw new Error("Email already registered");
    }

    const mobileExists = await AdminModel.findOne({ mobno: input.mobno });
    if (mobileExists) {
      throw new Error("Mobile number already registered");
    }
    

    const user = await AdminModel.create(input);
    return omit(user.toJSON(),'password')

  }
  catch(e:any){
    throw e;
  }
}


export async function  validatePassword({mobno,password}:{mobno:string,password:string}) {

  const user = await AdminModel.findOne({mobno});

  if(!user){
    return false;
  }

  const isValid = await user.comparePassword(password);

  if(!isValid) return false;

  return omit(user.toJSON(),'password');
  
}


export async function findUser(query: FilterQuery<AdminDocument>) {
  return AdminModel.findOne(query).lean();
}

