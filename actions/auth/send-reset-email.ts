// @ts-nocheck

import nodemailer from "nodemailer";

export async function sendResetEmail(email, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Prayogik: Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email" };
  }
}
