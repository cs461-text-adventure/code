"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import ErrorComponent from "@/components/auth/error";

export default function SigninForm() {
  const router = useRouter();
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
      setHasClearedError(true); // Prevents further clearing after the first reset
    }
  };

  async function signInWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signIn.email(
      {
        email: email,
        password: password,
      },
      {
        onRequest: () => {
          //show loading
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
          setBorderColor("border-red-500");
          setHasClearedError(false);
        },
      },
    );
  }

  return (
    <form
      onSubmit={signInWithEmail}
      onClick={handleUserInteraction}
      onInput={handleUserInteraction}
    >
      <div className="flex flex-col">
        {errorMessage && <ErrorComponent message={errorMessage} />}

        <label className="mb-2 text-sm" htmlFor="">
          Email
        </label>
        <input
          className={`dark:bg-black ${borderColor} dark:border-gray-800 border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none`}
          name="email"
          type="email"
          required
          autoCapitalize="none"
          autoFocus
          autoCorrect="off"
        ></input>
        <div className="flex justify-between">
          <label className="mb-2 text-sm" htmlFor="">
            Password
          </label>
          <Link className="text-sm text-blue-500 h-6" href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        {/* CHATGPT CODE CLEAN UP */}
        <div
          className={`flex flex-row border rounded-lg mb-2 dark:bg-black dark:border-gray-800 ${borderColor} w-full focus-within:ring-2 focus-within:ring-blue-500`}
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
        Continue
      </button>
    </form>
  );
}
