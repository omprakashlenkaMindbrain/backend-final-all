import UserModel from "../User/models/user.model";

export async function generateReferralCode(): Promise<string> {
  const prefix = "BLO";
  const lastUser = await UserModel.findOne({ memId: { $regex: `^${prefix}` } })
    .sort({ memId: -1 })
    .lean();

  const lastNumber = lastUser
    ? parseInt(lastUser.memId.replace(prefix, ""), 10)
    : 0;

  const newNumber = lastNumber + 1;
  return `${prefix}${newNumber.toString().padStart(4, "0")}`;
}
