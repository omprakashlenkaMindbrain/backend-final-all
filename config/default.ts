import dotenv from "dotenv";
dotenv.config();

export default {
  MODE: process.env.MODE || "dev",

  port: process.env.PORT ? Number(process.env.PORT) : 8030,

  dbURL: process.env.DB_URL as string,

  saltWorkFactor: process.env.SALT_WORK_FACTOR
    ? Number(process.env.SALT_WORK_FACTOR)
    : 10,

  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "1y",

  secretKey: process.env.SECRET_KEY as string,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,

  APP_NAME: process.env.APP_NAME || "mlm",

  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
  EMAIL_SENT: process.env.EMAIL_SENT === "true",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
};
