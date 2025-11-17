import config from "config";
import { Request, Response } from "express";
import { omit } from "lodash";
import UserModel from "../../User/models/user.model";
import kycmodel from "../../kyc/models/kyc.models";
import { signJwt } from "../../utils/jwt.utils";
import { sendMail } from "../../utils/mails/sendmail";
import AdminSessionModel from "../models/session.model";
import AdminModel from "../models/user.model";
import {
  createSession,
  findSessions,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";


export async function createAdminSessionHandler(req: Request, res: Response) {
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
    secure: true,       // only over HTTPS
    sameSite: "strict", // helps prevent CSRF
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  });


  return res.send({accessToken,refreshToken});
}


export async function getAdminSessionsHandler(req:Request, res: Response) {
  console.log(req);
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });
 const admin = omit(await AdminModel.findById(userId).lean(), "password");


  return res.send({sessions,admin});
}

export async function deleteSessionHandler(_req:Request,res: Response) {
  const sessionId = res.locals.user.session;

  await AdminSessionModel.findByIdAndDelete(sessionId);

  return res.send({
    accessToken: null,
    refreshToken: null,
    message: "Session destroyed successfully",
  });
}

;

export const getAllUsersWithKycAndPlan = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.aggregate([
      // Join with KYC
      {
        $lookup: {
          from: "kycmodels",
          localField: "_id",
          foreignField: "userid",
          as: "kyc",
        },
      },
      { $unwind: { path: "$kyc", preserveNullAndEmptyArrays: true } },

      // Join with Plan
      {
        $lookup: {
          from: "plans",
          localField: "_id",
          foreignField: "userId",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },

      // Select fields
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          mobno: 1,
          createdAt: 1,               // user.createdAt
          "kyc.adhara_img": 1,
          "kyc.pan_img": 1,
          "kyc.status": 1,
          "plan.plan_name": 1,
          planCreatedAt: "$plan.createdAt",   //  FIXED
          "plan.payment_ss": 1,
        },
      },

      // Sort by USER createdAt (newest first)
      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },
    ]);

    const totalUsers = await UserModel.countDocuments();

    return res.status(200).json({
      success: true,
      message: "All users with their KYC and Plan details fetched successfully",
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
      data: users,
    });
  } catch (err: any) {
    console.error("Error fetching users with KYC and Plan:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
export const updateKycStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id = user's _id (whose KYC admin is updating)
    const { status, adminComment } = req.body;
    console.log("Hello world") 

    // ✅ Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: approved, rejected",
      });
    }

    // ✅ Find KYC for this user
    const existingKyc = await kycmodel.findOne({ userid: id });
    if (!existingKyc) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found for this user",
      });
    }

    // ✅ Update KYC
    existingKyc.status = status;
    existingKyc.adminComment = adminComment || "";
    await existingKyc.save();

    // ✅ Fetch user info for email
    const user = await UserModel.findById(existingKyc.userid).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for this KYC record",
      });
    }

    // ✅ Send email to user about KYC status
    if (user.email) {
      await sendMail({
        to: user.email,
        subject: "KYC Status Update",
        html: `
          <p>Dear ${user.name || "User"},</p>
          <p>Your KYC status has been <strong>${status.toUpperCase()}</strong>.</p>
          ${
            adminComment
              ? `<p><strong>Admin Comment:</strong> ${adminComment}</p>`
              : ""
          }
          <p>Thank you for using our service.</p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `KYC ${status} successfully`,
      data: existingKyc,
      
    });
  } catch (error: any) {
    console.error("Error updating KYC:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
