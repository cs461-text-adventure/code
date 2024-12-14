"use client";

import SigninForm from "@/components/auth/SigninForm";
import Providers from "@/components/auth/Providers";
import Splitter from "@/components/auth/splitter";

export default function Login() {
  return (
    <div className="p-8 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
      <h1 className="text-lg font-bold text-center">
        Sign in to {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <p className="text-gray-500 text-center mb-8 text-sm">
        Welcome back! Please sign in to continue
      </p>
      <SigninForm />
      <Splitter />
      <Providers />
    </div>
  );
}
