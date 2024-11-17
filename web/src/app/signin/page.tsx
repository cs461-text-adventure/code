"use client";

import React from 'react';
import { FormEvent, useState } from "react";
import { auth } from "../utils/auth-client.ts";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link.js";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [borderColor, setBorderColor] = useState("border-gray-300");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasClearedError, setHasClearedError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserInteraction = () => {
    if (errorMessage && !hasClearedError) {
      setBorderColor("border-gray-300");
      setErrorMessage("");
      setHasClearedError(true); // Prevents further clearing after the first reset
    }
  };

  async function signInWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.signIn.email({
      email: email,
      password: password,
    }, {
      onRequest: () => {
        //show loading
      },
      onSuccess: () => {
        router.push("/forge"); // TODO:
      },
      onError: (ctx) => {
        setErrorMessage(
          ctx.error.message,
        );
        setBorderColor("border-red-500");
        setHasClearedError(false);
      },
    });
  }

  async function signInWithSocial(
    provider:
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
      | "gitlab",
  ) {
    const response = await auth.signIn.social({
      provider: "discord",
      callbackURL: "/forge",
    });
  }

  async function signInWithAuthentik() {
    const response = await auth.signIn.oauth2({
      providerId: "authentik",
      callbackURL: "/forge",
    });
  }

  // async function signInWithOIDC(
  //   provider:
  //     | "github"
  //     | "apple"
  //     | "discord"
  //     | "facebook"
  //     | "google"
  //     | "microsoft"
  //     | "spotify"
  //     | "twitch"
  //     | "twitter"
  //     | "dropbox"
  //     | "linkedin"
  //     | "gitlab"
  //     | "authentik"
  // ) {
  //   router.push(`/api/auth/oidc/${provider}`);
  // }

  async function signInWithPasskey() {
    const data = await auth.signIn.passkey();
    console.log(data);
    if (data?.error) {
      setErrorMessage(
        data.error.message!,
      );
      setHasClearedError(false);
    }
    const callbackUrl = searchParams.get("callbackUrl") || "/forge";

    // TODO: VALIDATE CALLBACK URL REDIRECT!!!
    router.push(callbackUrl);
  }

  return (
    <main
      className={`md:flex md:items-center md:justify-center min-h-screen min-w-64 dark:bg-gray-900 md:dark:bg-black`}
    >
      <div>
        <div className="p-6 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-96 w-full text-md md:border border-gray-300 dark:border-gray-800">
          <form
            onSubmit={signInWithEmail}
            onClick={handleUserInteraction}
            onInput={handleUserInteraction}
          >
            <div className="flex flex-col">
              <h1 className="text-3xl mb-4 dark:text-[#f3f3f3]">Sign in</h1>

              {errorMessage && (
                <div className="flex mb-4 w-full text-center">
                  <label className="p-4 dark:text-white w-full border-red-500 border-2 text-black rounded-lg">
                    {errorMessage}
                  </label>
                </div>
              )}

              <label
                className="dark:text-white text-black mb-2 text-sm"
                htmlFor=""
              >
                Email
              </label>
              <input
                className={`dark:bg-black ${borderColor} dark:border-gray-800 border p-2 rounded-lg mb-4 dark:text-white text-black`}
                name="email"
                type="email"
                required
                autoCapitalize="none"
                autoFocus
                autoCorrect="off"
              >
              </input>
              <label
                className="dark:text-white text-black mb-2 text-sm"
                htmlFor=""
              >
                Password
              </label>

              {/* CHATGPT CODE CLEAN UP */}
              <div
                className={`flex flex-row border rounded-lg mb-2 dark:bg-black dark:border-gray-800 ${borderColor} dark:text-white text-black w-full focus-within:ring-2 focus-within:ring-blue-500`}
              >
                <input
                  className="p-2 dark:bg-black flex-1 rounded-lg outline-none"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className="flex-none flex items-center justify-center">
                  {/* Conditionally render the button only if the password field has text */}
                  {password && (
                    <button
                      className="text-sm text-gray-500 px-3"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              </div>
              {/* CHATGPT CODE CLEAN UP */}
            </div>

            {/* Sign In Button */}
            <button
              className="mt-4 text-rg text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
              type="submit"
            >
              Sign in
            </button>

            {/* Horizontal Splitter */}
            <div className="flex items-center justify-center mt-6">
              <div className="border-t dark:border-gray-800 border-gray-300 flex-grow">
              </div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t dark:border-gray-800 border-gray-300 flex-grow">
              </div>
            </div>
          </form>

          {/* Sign In With Passkey Button */}
          <button
            className="w-full mt-6 p-2 text-center text-white bg-gray-700 hover:bg-gray-800 rounded-lg flex items-center justify-center"
            onClick={signInWithPasskey}
          >
            {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
            <svg
              className="h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="#ffffff"
            >
              <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17l0 80c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24l0-40 40 0c13.3 0 24-10.7 24-24l0-40 40 0c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
            </svg>
            <p>Sign in with Passkey</p>
          </button>

          {/* Sign in with Discord */}
          <button
            className="w-full mt-4 p-2 flex flex-row items-center bg-[#5865F2] rounded-lg text-center flex justify-center hover:bg-[#4e5bd8]"
            onClick={(e) => {
              e.preventDefault();
              signInWithSocial("discord");
            }}
          >
            <img
              className="h-4 w-4 mr-2"
              src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
            />
            <p className="text-white">Sign in with Discord</p>
          </button>

          {/* Sign in with Authentik */}
          <button
            className="w-full mt-4 p-2 text-center text-white bg-[#fd4b2d] hover:bg-[#e64528] rounded-lg flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              signInWithAuthentik();
            }}
          >
            <img
              className="w-4 h-4 mr-2"
              src="https://auth.instantmc.gg/static/dist/assets/icons/icon.svg"
            >
            </img>
            <p>Sign in with Authentik</p>
          </button>
        </div>

        <div className="md:mt-4 p-4 md:rounded-3xl dark:bg-slate-900 bg-white md:w-96 w-full text-md md:border border-gray-300 dark:border-gray-800">
          <div className="text-center dark:text-white text-black">
            Don't have an acount?{" "}
            <Link href="/signup" className="text-blue-500">Sign up</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
