"use client";
import { FormEvent, useState, Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ErrorComponent from "@/components/auth/error";

export default function ResetPassword() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  // Redirect on unauthorized (token missing)
  if (!token) {
    notFound();
  }

  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [textColor, setTextColor] = useState("text-gray-500");

  // const passwordsMatch = password === confirmPassword;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);
  };

  function checkPassword() {
    if (password.length < 12 || password.length > 100) {
      setTextColor("text-red-500");
    } else {
      setTextColor("text-gray-500");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password != confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token: token!,
      });
      if (error) {
        setErrorMessage(error.message!);
      }
      console.log(data);
      // TODO: Display confirmation password was changed
    }
  }

  return (
    <main
      className={`flex font-sans bg-gray-50 items-center justify-center min-h-screen min-w-64 dark:bg-gray-950 p-4`}
    >
      <div>
        <div className="p-4 rounded-3xl dark:bg-slate-900 bg-white sm:w-96 min-w-64 w-[calc(100vw-32px)] text-md border border-gray-300 dark:border-gray-800">
          <h1 className="text-lg text-center font-bold mb-6">
            Reset Your Password
          </h1>
          {errorMessage && <ErrorComponent message={errorMessage} />}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2 text-sm" htmlFor="">
              New Password
            </label>

            {/* CHATGPT CODE CLEAN UP */}
            <div
              className={`flex flex-row border rounded-lg mb-2 dark:bg-black border-gray-300 dark:border-gray-800 w-full focus-within:ring-2 focus-within:ring-blue-500`}
            >
              <input
                className={`p-2 dark:bg-black flex-1 rounded-lg outline-none`}
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onInput={handlePasswordChange}
                onBlur={checkPassword}
                required
                autoFocus
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

            <p className={`text-xs ${textColor}`}>
              Must be between 12-100 characters
            </p>

            <label className="mt-4 mb-2 text-sm" htmlFor="email">
              Confirm Password
            </label>
            <input
              className={`dark:bg-black border-gray-300 dark:border-gray-800 border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none`}
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onInput={handleConfirmPasswordChange}
              required
              minLength={12}
              maxLength={100}
            ></input>

            {/* <p
              className={`text-xs ${
                passwordsMatch ? "hidden" : "block"
              } mb-2 text-red-500`}
            >
              Passwords do not match
            </p> */}

            <button
              className="mt-4 text-rg text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
              type="submit"
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
