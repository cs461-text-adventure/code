"use client";

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
  callbackURL = `https://texterra.xyz/dashboard`, // TODO: replace with domain
}: Readonly<{
  children?: React.ReactNode;
  className?: string;
  provider: Provider;
  callbackURL: string;
}>) {
  async function signInWithProvider(provider: Provider) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in/social`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: provider,
            callbackURL: callbackURL, // TODO: replace with domain
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "An unknown error occurred");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.log(error);
    }
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
