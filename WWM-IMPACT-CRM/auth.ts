import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./node_modules/@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  plugins: [
    magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {

        },
    })
  ],
});