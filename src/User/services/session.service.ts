
import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { verifyJwt, signJwt } from "../../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}


export async function reIssueAccessToken({refreshToken}:{refreshToken:string}){
    
    const {decode}=verifyJwt(refreshToken)

    if(!decode || !get(decode,'session') ) return false

    const session = await SessionModel.findById(get(decode,"session"));

    if(!session || !session.valid) return  false;

    const user = await findUser({_id:session.user});

    if(!user) return false

     const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('accessTokenTtl') } // "15m"
    );

    return accessToken

}
