import nodemailer from "nodemailer";
import env from "../config/env";

class EmailService {
  private emailTransporter = nodemailer.createTransport(
    env.NODE_ENV === "production"
      ? {
          // Gmail for Production
          service: "gmail",
          auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_APP_PASSWORD,
          },
        }
      : {
          // Mailtrap for Development
          host: env.MAILTRAP_HOST,
          port: env.MAILTRAP_PORT,
          auth: {
            user: env.MAILTRAP_USER,
            pass: env.MAILTRAP_PASS,
          },
        }
  );

  async sendResetEmail(email: string, firstName: string, token: string) {
    const resetURL =
      env.NODE_ENV === "production"
        ? `${env.FRONTEND_URL}/reset-password/${token}`
        : `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: env.NODE_ENV === "production" ? env.GMAIL_USER : "noreply@stabraq.com", // Can be any email in development
      to: email,
      subject: "Password Reset Request - Stabraq",
      html: `
      <h2>Hello ${firstName},</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetURL}" style="background: #32b72fff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>Stabraq Team</p>
      ${
        env.NODE_ENV === "development"
          ? "<p><em>This is a test email sent via Mailtrap</em></p>"
          : ""
      }
    `,
    };

    await this.emailTransporter.sendMail(mailOptions);
  }
}

export default new EmailService();
