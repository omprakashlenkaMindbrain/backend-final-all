import { Request, Response } from "express";
import { uploadfile } from "../../utils/upload";
import kycmodel from "../models/kyc.models";
import { sendMail } from "../../utils/mails/sendmail";
import config from "config";
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user || !user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    const existUser = await kycmodel.findOne({ userid: user._id })
    if (existUser) {
      return res.status(404).json({ msg: "KYC already uploaded. You cannot upload again." })
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const adharaFile = files?.adhara_img?.[0];
    const panFile = files?.pan_img?.[0];
    const [adharaUpload, panUpload] = await Promise.all([
      uploadfile(adharaFile.buffer, "kyc"),
      uploadfile(panFile.buffer, "kyc"),
    ]);

    if (!adharaUpload || !panUpload) {
      return res.status(500).json({ msg: "Cloudinary upload failed" });
    }
    const kycData = await kycmodel.create({
      userid: user._id,
      adhara_img: adharaUpload.url,
      pan_img: panUpload.url,
    });
    Promise.allSettled([
      user.email &&
      sendMail({
        to: user.email,
        subject: "KYC Upload Confirmation",
        html: `<p>Your KYC has been uploaded successfully.</br>
      
        Our verification team will review your submission shortly.
        You’ll receive an email notification once the verification process is complete.
      </p>`,
      }),
      sendMail({
        to: config.get<string>("ADMIN_EMAIL"),
        subject: "New KYC Submission Alert",
        html: `<p>${user.name} uploaded new KYC documents.</p>`,
      }),
    ]);
    res.status(201).json({
      message: "KYC uploaded successfully",
      data: kycData,
    });

  } catch (error: any) {
    console.error("Error uploading KYC:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//
export const updatekyc = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user || !user._id) {
      return res.status(404).json({ msg: "User not found" });
    }

    const existingKyc = await kycmodel.findOne({ userid: user._id });
    if (!existingKyc) {
      return res.status(404).json({ msg: "No existing KYC found to update" });
    }

    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "No files provided for update" });
    }

    const updatedimg: Partial<{ adhara_img: string; pan_img: string }> = {};


    const [adharaUpload, panUpload] = await Promise.all([
      files.adhara_img?.[0]
        ? uploadfile(files.adhara_img[0].buffer, "kyc")
        : Promise.resolve(null),
      files.pan_img?.[0]
        ? uploadfile(files.pan_img[0].buffer, "kyc")
        : Promise.resolve(null),
    ]);

    if (adharaUpload?.url) updatedimg.adhara_img = adharaUpload.url;
    if (panUpload?.url) updatedimg.pan_img = panUpload.url;

    //  Update the database record
    const updatedKyc = await kycmodel.findOneAndUpdate(
      { userid: user._id },
      {
        ...updatedimg,
        status: "pending",       // reset status automatically
        updatedAt: new Date(),
      },
      { new: true }
    );

    //  Respond immediately (don’t wait for emails)
    res.status(200).json({
      success: true,
      message: "KYC updated successfully",
      data: updatedKyc,
    });

    //  Send emails asynchronously (non-blocking)
    Promise.allSettled([
      user.email &&
      sendMail({
        to: user.email,
        subject: "KYC Updated Successfully",
        html: `
            <h2>KYC Updated Successfully</h2>
            <p>Dear ${user.name || "User"},</p>
            <p>Your KYC documents were successfully updated on ${new Date().toLocaleString()}.</p>
          `,
      }),
      sendMail({
        to: config.get<string>("ADMIN_EMAIL"),
        subject: "KYC Update Notification",
        html: `
          <h2>User KYC Updated</h2>
          <p><strong>${user.name || "Unknown User"}</strong> updated their KYC documents.</p>
          <p><strong>User ID:</strong> ${user._id}</p>
          <p><strong>Updated at:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
    ]).catch((err) => console.error("Email send error:", err));
  } catch (err: any) {
    console.error("Error updating KYC:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update KYC",
      error: err.message,
    });
  }
};