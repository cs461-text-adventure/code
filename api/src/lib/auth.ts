import "dotenv/config";
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@db";
import * as schema from "@db";
import { hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";
import { isProduction, DOMAIN, ORIGIN } from "@config";

// import { reactInvitationEmail } from "./email/invitation";
// import { reactResetPasswordEmail } from "./email/rest-password";
import { sendEmail } from "@email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`, // TODO: Change to HTML template
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 100,
    password: {
      hash: (password) => argon2Hash(password),
      verify: ({ hash, password }) => argon2Verify(hash, password),
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Here is your reset token: <b>https://${DOMAIN}/reset-password?token=${token}</b>`, // TODO: Create email template
      });
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    passkey({
      rpID: "localhost", // TODO: unique identifer
      rpName: process.env.APP_NAME as string,
      origin: ORIGIN,
    }),
    openAPI(),
    // emailOTP({
    //   async sendVerificationOTP({ email, otp, type}) {
    //     if (type === "sign-in") {
    //       // Send the OTP for sign-in
    //     } else if (type === "email-verification") {
    //       await sendEmail({
    //         to: email,
    //         subject: "Verify your email address",
    //         text: `<p>VERIFY: ${otp}</p>`, // TODO: Change to HTML template
    //       });
    //     } else {
    //       await sendEmail({
    //         to: email,
    //         subject: "Reset your password",
    //         text: `<p>PASSWORD: ${otp}</p>`, // TODO: Change to HTML template
    //       });
    //     }
    //   },
    //   otpLength: 6,
    //   expiresIn: 600,
    //   sendVerificationOnSignUp: true,
    //   disableSignUp: true
    // }),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: isProduction,
      domain: `.${DOMAIN}`, // Domain with a leading period
    },
    defaultCookieAttributes: {
      secure: isProduction, // Only secure in production
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // Allows CORS-based cookie sharing across subdomains
      partitioned: isProduction, // Only partitioned when secure
    },
  },
  trustedOrigins: isProduction
    ? [`https://${DOMAIN}`, `https://api.${DOMAIN}`]
    : ["http://localhost"],
});
