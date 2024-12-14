"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import ErrorComponent from "@/components/auth/error";

export default function ResetPassword() {
  const [step, setStep] = useState(2);
  const [email, setEmail] = useState("test@gmail.com");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    setEmail(emailInput);

    try {
      console.log(`DA EMAIL: ${email}`)
      const {data, error} = await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "forget-password"
      })
      if (error) throw new Error(error.message);
      setStep(2);
    } catch (error: any) {
      console.log(error)
      setErrorMessage(error.message || "An error occurred. Please try again.");
    }
  }

  // const [otp, setOtp] = useState("");
  // async function handleOTPSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);
  //   const otpInput = formData.get("otp") as string;
  //   setOtp(otpInput);

  //   try {
  //     console.log(`DA EMAIL: ${email}`)
  //     console.log(`DA OTP: ${otp}`)
  //     const {data, error} = await authClient.emailOtp.verifyEmail({
  //       email: email,
  //       otp: otp
  //     })
  //     if (error) throw new Error(error.message);
  //     setStep(3);
  //   } catch (error: any) {
  //     console.log(error)
  //     setErrorMessage(error.message || "An error occurred. Please try again.");
  //   }
  // }

  function renderEmailInput() {
    return (
      <div className="p-8 rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md border border-gray-300 dark:border-gray-800">
        {errorMessage && <ErrorComponent message={errorMessage} />}
        <h1 className="text-lg text-center font-bold">Reset Your Password</h1>
        <p className="mb-8 text-sm text-gray-500 text-center">
          Enter your {process.env.NEXT_PUBLIC_APP_NAME} email address to receive
          a reset link.
        </p>

        <form className="mt-4 flex flex-col" onSubmit={handleEmailSubmit}>
          <label className="mb-2 text-sm" htmlFor="email">
            Email Address
          </label>
          <input
            className={`dark:bg-black border-gray-300 dark:border-gray-800 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
            name="email"
            type="email"
            required
            autoCapitalize="none"
            autoFocus
            autoCorrect="off"
          ></input>
          <button
            className="mt-4 text-rg text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
            type="submit"
          >
            Continue
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center w-full text-sm underline text-blue-500"
        >
          Back to sign-in
        </Link>
      </div>
    );
  }

  // function renderTokenInput() {
  //   return (
  //     <div className="p-8 rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md border border-gray-300 dark:border-gray-800">
  //       {errorMessage && <ErrorComponent message={errorMessage} />}
  //       <h1 className="text-lg text-center font-bold">Check Your Inbox</h1>
  //       <p className="mb-4 text-sm text-gray-500 text-center">
  //         Enter the 6-digit security code we sent to <b>{email}</b>.
  //       </p>

  //       <form className="mt-4 flex flex-col" onSubmit={handleOTPSubmit}>
  //       {/* OTP Input */}
  //       <input
  //           className={`dark:bg-black border-gray-300 dark:border-gray-800 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
  //           name="otp"
  //           type="text"
  //           required
  //           autoCapitalize="none"
  //           autoFocus
  //           autoCorrect="off"
  //         ></input>

  //       <button
  //         className="mt-4 text-rg text-white w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
  //         type="submit"
  //       >
  //         Continue
  //       </button>
  //       </form>
  //     </div>
  //   );
  // }

  function renderConfirmation() {
    return (
      <div>
        <div className="p-8 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <h1 className="text-lg text-center font-bold">Check Your Inbox</h1>
          <p className="text-sm text-gray-500 text-center">
          Please check your inbox for a reset link and click on the
          link to complete the registration process.
            We sent a reset link to <span className="font-semibold text-black">{email}</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main
      className={`flex font-sans bg-gray-50 items-center justify-center min-h-screen min-w-64 dark:bg-gray-950`}
    >
      {step === 1 ? renderEmailInput() : renderConfirmation()}
    </main>
  );
}
