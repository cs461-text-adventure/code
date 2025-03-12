"use client";

import Link from "next/link.js";

import { FormEvent, ReactElement, useState } from "react";
import Providers from "@/components/auth/Providers";
import Splitter from "@/components/auth/splitter";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [borderColor, setBorderColor] = useState("border-gray-300");
  const [hasClearedError, setHasClearedError] = useState(false);

  const [error, setError] = useState<ReactElement>();

  const [textColor, setTextColor] = useState("text-gray-500");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  function checkPassword() {
    if (password.length < 12 || password.length > 100) {
      setTextColor("text-red-500");
    } else {
      setTextColor("text-gray-500");
    }
  }

  const handleUserInteraction = () => {
    if (!hasClearedError) {
      setBorderColor("border-gray-300");
      setHasClearedError(true); // Prevents further clearing after the first reset
    }
  };

  async function signUpWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up/email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            image: undefined,
            callbackURL: `https://texterra.xyz/dashboard`, // TODO: replace with domain
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "An unknown error occurred");
      }

      setStep(2);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);

        if (error.message == "User already exists") {
          setError(
            <div className="flex mb-4 w-full text-center">
              <p className="p-4 w-full bg-red-600/25 text-red-700 dark:text-red-500 border border-red-600 rounded-lg text-sm">
                User with this email already exists.{" "}
                <Link
                  href="/forgot-password"
                  className="text-blue-500 underline"
                >
                  Forgot password?
                </Link>
              </p>
            </div>,
          );
          setHasClearedError(false);
        } else {
          setBorderColor("border-red-500");
          setHasClearedError(false);
        }
      }
    }
  }

  function renderForm() {
    return (
      <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
        <h1 className="text-lg text-center font-bold">Create Account</h1>
        <p className="mb-4 text-sm text-gray-500 text-center">
          Welcome! Please fill in the details to get started.
        </p>

        <Providers />
        <Splitter />

        <form
          onSubmit={signUpWithEmail}
          onClick={handleUserInteraction}
          onInput={handleUserInteraction}
        >
          <div className="flex flex-col">
            {error}

            <label className="mb-2 text-sm" htmlFor="email">
              Email Address
            </label>
            <input
              className={`dark:bg-black border-gray-300 dark:border-gray-800 border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none`}
              name="email"
              type="email"
              required
              autoCapitalize="none"
              autoFocus
              autoCorrect="off"
            ></input>

            <label className="mb-2 text-sm" htmlFor="name">
              Display Name
            </label>
            <input
              className={`dark:bg-black ${borderColor} dark:border-gray-800 border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none`}
              name="name"
              type="text"
              required
              autoCapitalize="none"
              autoCorrect="off"
            ></input>

            <label className="mb-2 text-sm" htmlFor="">
              Password
            </label>

            {/* CHATGPT CODE CLEAN UP */}
            <div
              className={`flex flex-row border rounded-lg mb-2 dark:bg-black dark:border-gray-800 ${borderColor} w-full focus-within:ring-2 focus-within:ring-blue-500`}
            >
              <input
                className={`p-2 dark:bg-black flex-1 rounded-lg outline-none`}
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onInput={handlePasswordChange}
                onBlur={checkPassword}
                required
                minLength={12}
                maxLength={100}
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

          <div className="">
            <p className={`text-xs ${textColor}`}>
              Must be between 12-100 characters
            </p>
          </div>

          <div className="mt-8 flex flex-row text-gray-500 text-sm gap-2">
            <p>
              By continuing, you agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-blue-500 underline"
              >
                Terms of Service
              </Link>
              &nbsp;and&nbsp;
              <Link
                href="/privacy"
                target="_blank"
                className="text-blue-500 underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Sign In Button */}
          <button
            className="mt-4 text-rg text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  function renderConfirmation() {
    return (
      <div>
        <div className="pt-8 pl-8 pr-8 md:pb-8 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <h1 className="text-lg text-center font-bold">Verify Your Email</h1>
          <p className="text-sm text-gray-500 text-center">
            Please check your inbox for a verification email and click on the
            link to complete the registration process.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950`}
    >
      <div>
        {step === 1 ? renderForm() : renderConfirmation()}

        {step === 1 && (
          <div>
            <div className="mx-8 md:mx-0">
              <div className="md:mt-4 p-4 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
                <div className="text-center text-sm font-regular text-gray-500">
                  Have an acount?{" "}
                  <Link href="/login" className="text-blue-500">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
