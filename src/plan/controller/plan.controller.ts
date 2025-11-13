import { Request, Response } from "express";
import { planmodel } from "../model/plan.model";
import { uploadfile } from "../../utils/upload";

export const plancontroller = async (req: Request, res: Response) => {
  try {
    const { plan_name } = req.body;

    const allowedPlans = ["gold", "silver", "premium", "platinum"];
    if (!plan_name || !allowedPlans.includes(plan_name.toLowerCase())) {
      return res.status(400).json({
        msg: "Please choose a valid plan: gold, silver, premium, platinum",
      });
    }

    // ✅ Check user authentication
    const user = res.locals.user;
    if (!user || !user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    // ✅ Get uploaded file (payment screenshot)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const paymentFile = files?.payment_ss?.[0];
    if (!paymentFile) {
      return res.status(400).json({ msg: "Payment screenshot is required" });
    }

    // ✅ Upload file to Cloudinary
    const payment = await uploadfile(paymentFile.buffer, "payment_screenshots");
    if (!payment?.url) {
      return res.status(500).json({ msg: "Failed to upload payment screenshot" });
    }

    // ✅ Create plan entry in DB
    const planData = await planmodel.create({
      plan_name: plan_name.toLowerCase(),
      userId: user._id,
      payment_ss: payment.url,
    });

    return res
      .status(201)
      .json({ planData, msg: "Plan chosen successfully" });
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return res
      .status(500)
      .json({ msg: "Plan not created", error: error.message });
  }
};
