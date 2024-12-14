import { createAuthClient } from "better-auth/react";
import { passkeyClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [passkeyClient(), emailOTPClient()],
});

export const {
  signIn,

  signOut,

  signUp,

  useSession,
} = authClient;
