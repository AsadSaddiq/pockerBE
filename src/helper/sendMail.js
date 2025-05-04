import nodemailer from "nodemailer";
import mailConfig from "../config/nodemailerConfig.js";

const transporter = nodemailer.createTransport(mailConfig);

export const sendMailHelper = async ({
  to,
  subject,
  referralCode,
  roles,
  message,
}) => {
  const mailOptions = {
    from: mailConfig.auth.user,
    to,
    subject,
    html: `  <!-- Use html for HTML formatted emails -->
      <p><strong>Your referral code:</strong> <strong>${referralCode}</strong></p>
      <p><strong>Your role:</strong> ${roles}</p>
      <br>
      <p>${message}</p>`,
  };

  return transporter.sendMail(mailOptions);
};
