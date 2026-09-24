import nodemailer from 'nodemailer';
import { LEVEL_UP_HTML } from './levelUpEmailTemplate.ts';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendLevelUpEmail = async (email: string, newLevel: number): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Level ${newLevel} Has Been Reached! 🚀`,
    html: LEVEL_UP_HTML,
  });
};
