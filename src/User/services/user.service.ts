import { FilterQuery } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { generateReferralCode } from "../../utils/refer";
import {UpdateUserInput} from '../schema/user.update.schema';
//import kycmodel from "../models/";
//import paymodel from "../"; //update these fields

export async function createUser(input: CreateUserInput) {
  try {
    const emailExists = await UserModel.findOne({ email: input.email });
    if (emailExists) throw new Error("Email already registered");
    const mobileExists = await UserModel.findOne({ mobno: input.mobno });
    if (mobileExists) throw new Error("Mobile number already registered");



    
    const userCount = await UserModel.countDocuments();

    let trackingId: string | null = null;
    let referrer: any = null;
    let legPosition: "leftLeg" | "rightLeg" | null = null;

    
    if (userCount === 0) {
      trackingId = null; 
    } else {
      
      if (!input.trackingId) {
        throw new Error("Tracking ID is required after the first user");
      }

      
      referrer = await UserModel.findOne({ memId: input.trackingId });
      if (!referrer) throw new Error("Invalid tracking ID");

      
      if (!referrer.leftLeg) {
        legPosition = "leftLeg";
      } else if (!referrer.rightLeg) {
        legPosition = "rightLeg";
      } else {
        throw new Error("Referral limit reached for this user");
      }

      trackingId = referrer.memId;
    }

    
    const newMemId = await generateReferralCode();

    
    const newUser = await UserModel.create({
      name: input.name,
      email: input.email,
      mobno: input.mobno,
      password: input.password,
      memId: newMemId,
      trackingId,
      referralCount: 0,
    });

    
    if (referrer && legPosition) {
      await UserModel.updateOne(
        { _id: referrer._id },
        {
          $set: { [legPosition]: newUser._id },
          $inc: { referralCount: 1 },
        }
      );
    }

   
    return omit(newUser.toJSON(), ["password"]);
  } catch (e: any) {
    throw new Error(e.message || "Failed to create user");
  }
}

export async function validatePassword({
  mobno,
  password,
}: {
  mobno: string;
  password: string;
}) {
  const user = await UserModel.findOne({ mobno });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}



export async function updateUser(userId: string, updates: UpdateUserInput) {
  try {
    
    const user = await UserModel.findById(userId);
   // const userKyc = await kycmodel.findById(userId);
   // const userPlan = await planmodel.findById(userId);
    if (!user) {
      return null;
    }

    
    if (updates.name) {
      user.name = updates.name;
    }

    if (updates.email) {
      user.email = updates.email;
    }

    if (updates.mobno) {
      user.mobno = updates.mobno;
    }

    // if (updates.adhara_img) {
    //   user.adhara_img = updates.adhara_img;
    // }

    // if (updates.pan_img) {
    //   user.pan_img = updates.pan_img;
    // }

    // if (updates.plan_name) {
    //   user.plan_name = updates.plan_name;
    // }

    // if (updates.payment_cs) {
    //   user.payment_cs = updates.payment_cs;
    // }

   
    await user.save();

   

    return omit(user.toObject(), ["password"]);
  } catch (error: any) {
    throw new Error("Error updating user: " + error.message);
  }
}





