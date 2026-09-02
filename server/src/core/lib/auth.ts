// internal-imports
import { env } from '../config/env.js';
import { prisma } from '../prisma/client.js';

// external-imports
import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';

// better-auth configuration
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: env.WEB_ORIGINS,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV !== 'development' ? 'none' : 'lax',
      secure: env.NODE_ENV !== 'development',
      httpOnly: true,
    },
  },
});
