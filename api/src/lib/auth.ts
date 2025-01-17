import "dotenv/config";
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index";
import { hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";
import * as schema from "@/db/schema";

// import { reactInvitationEmail } from "./email/invitation";
// import { reactResetPasswordEmail } from "./email/rest-password";
import { sendEmail } from "@/email/index";
const origin = process.env.ORIGIN || "http://localhost";

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
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Here is your reset token: <b>${url}</b>`, // TODO: Create email template
      });
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  plugins: [
    passkey({
      rpID: "localhost", // TODO: unique identifer
      rpName: process.env.APP_NAME as string,
      origin: origin,
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
      enabled: false, // TODO
      domain: "localhost",
    },
  },
  trustedOrigins: [origin],
});
