import config from "config";
import { Request, Response } from "express";
import { omit } from "lodash";
import kycmodel from "../../kyc/models/kyc.models";
import { planmodel } from "../../plan/model/plan.model";
import { signJwt } from "../../utils/jwt.utils";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import {
  createSession,
  findSessions,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

if (!user) {
    return res.status(401).send({success:false,message:"Invalid mob or password"});
  }

  const session = await createSession(user._id.toString(), req.get("user-agent") || "");

  // ACCESS TOKEN (15m)
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // "15m"
  );

  // REFRESH TOKEN (1y)
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // "1y"
  );

     res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,      
    sameSite: "strict", 
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  });

  return res.send({accessToken,refreshToken});


 
}

export async function getUserSessionsHandler(_req:Request, res: Response) {
  try {
    const userId = res.locals?.user._id;

    // ✅ Fetch user and sessions
    const sessions = await findSessions({ user: userId, valid: true });
    const user = omit(await UserModel.findById(userId).lean(), "password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 
    const [kyc, plan] = await Promise.all([
      kycmodel.findOne({ userid: userId }).select("adhara_img pan_img status" ).lean(),
      planmodel.findOne({ userId: userId }).select("plan_name").lean(),
    ]);
    const fullUser = {
      ...user,
      kyc: kyc || null,
      plan: plan || null,
    };

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: {
        user: fullUser,
        sessions,
      },
    });
  } catch (err: any) {
    console.error("Error fetching user details:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

export async function deleteSessionHandler(res: Response) {
  const sessionId = res.locals.user.session;

  await SessionModel.findByIdAndDelete(sessionId);

  return res.send({
    accessToken: null,
    refreshToken: null,
    message: "Session destroyed successfully",
  });
}



