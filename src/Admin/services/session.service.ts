
import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import AdminSessionModel, { AdminSessionDocument } from "../models/session.model";
import { verifyJwt, signJwt } from "../../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await AdminSessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<AdminSessionDocument>) {
  return AdminSessionModel.find(query).sort({ createdAt: -1 }).lean();
}

export async function updateSession(
  query: FilterQuery<AdminSessionDocument>,
  update: UpdateQuery<AdminSessionDocument>
) {
  return AdminSessionModel.updateOne(query, update);
}


//


export async function reIssueAccessToken({refreshToken}:{refreshToken:string}){
    
    const {decode}=verifyJwt(refreshToken)

    if(!decode || !get(decode,'session') ) return false

    const session = await AdminSessionModel.findById(get(decode,"session"));

    if(!session || !session.valid) return  false;

    const user = await findUser({_id:session.user});

    if(!user) return false

     const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('accessTokenTtl') } // "15m"
    );

    return accessToken

}

