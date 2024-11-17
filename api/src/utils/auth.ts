import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

import { db } from "../db/index.ts";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../db/schema.ts";

import * as argon2 from "@node-rs/argon2";

// import { resend } from "../email/index.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: false,
    },
  },
  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "discord", "authentik"],
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 100,
    requireEmailVerification: false, // TODO: CHANGE IN PROD
    password: {
      hash: async (password: string): Promise<string> => {
        return await argon2.hash(password);
      },
      verify: async (hash: string, password: string): Promise<boolean> => {
        return await argon2.verify(hash, password);
      },
    },
  },
  socialProviders: {
    discord: {
      clientId: Deno.env.get('DISCORD_CLIENT_ID') as string,
      clientSecret: Deno.env.get('DISCORD_CLIENT_SECRET') as string,
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "authentik",
          discoveryUrl: Deno.env.get('AUTHENTIK_DISCOVERY_URL') as string,
          type: 'oidc',
          clientId: Deno.env.get('AUTHENTIK_CLIENT_ID') as string,
          clientSecret: Deno.env.get('AUTHENTIK_CLIENT_SECRET') as string,
          scopes: ['openid', 'email', 'profile'],
          responseType: 'code',
          prompt: 'consent',
          accessType: 'offline',
          redirectURI: Deno.env.get('AUTH_URL') as string + '/api/auth/oauth2/callback/authentik'
        },
      ],
    }),
  ],
  trustedOrigins: [
    Deno.env.get('FRONTEND_URL') as string
  ]
});

type Session = typeof auth.$Infer.Session;