import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    // Closed system: only the admin account (created via scripts/create-admin.ts)
    // should ever exist. Without this, POST /api/auth/sign-up/email is still
    // publicly reachable and anyone could create an account with admin access.
    disableSignUp: true,
  },
});
