import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  plugins: [
    magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: '"WalkWithMe.global" <login@walkwithme.global>',
            to: email,
            subject: "WalkWithMe.global Login Link",
            html: `<a href=${url}>Log in!</a>`,
          });
        },
    })
  ],
});