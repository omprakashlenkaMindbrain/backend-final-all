import dotenv from 'dotenv';
dotenv.config();


export default {
  MODE: process.env.MODE  as string|| "prod",
  port: process.env.PORT || 8030,
  dbURL: process.env.DB_URL,
  saltWorkFactor: Number(process.env.SALT_WORK_FACTOR) || 10,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "1y",
  secretKey: process.env.SECRET_KEY,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  APP_NAME: process.env.APP_NAME,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_SENT: process.env.EMAIL_SENT === "true",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL
};