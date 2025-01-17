"use client";
import { authClient } from "@/lib/auth-client";

type Provider =
  | "github"
  | "apple"
  | "discord"
  | "facebook"
  | "google"
  | "microsoft"
  | "spotify"
  | "twitch"
  | "twitter"
  | "dropbox"
  | "linkedin"
  | "gitlab";

export default function OAuthButton({
  children,
  className = "",
  provider = "github",
  callbackURL = "/",
}: Readonly<{
  children?: React.ReactNode;
  className?: string;
  provider: Provider;
  callbackURL: string;
}>) {
  async function signInWithProvider(provider: Provider) {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: callbackURL,
    });
  }

  return (
    <button
      className={`${className} w-10 h-10 text-center flex justify-center border border-gray-300 rounded-lg dark:border-gray-800 dark:bg-black dark:text-white`}
      aria-label={`Sign in with ${provider}`}
      onClick={() => {
        signInWithProvider(provider);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        {children}
      </svg>
    </button>
  );
}
