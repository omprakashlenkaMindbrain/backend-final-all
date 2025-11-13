import  nodemailer  from 'nodemailer';
import config from "config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get('EMAIL_USER'),
    pass: config.get('EMAIL_PASS'),
  },
});

