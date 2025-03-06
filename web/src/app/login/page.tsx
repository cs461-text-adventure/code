"use client";

import { FormEvent, useState, ReactElement } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AuthMain from "@/components/auth/AuthMain";
import Card from "@/components/auth/card";
import Title from "@/components/auth/title";
import Description from "@/components/auth/description";
import AuthError from "@/components/auth/error";
import OAuthProviders from "@/components/auth/OAuthProviders";
import Splitter from "@/components/auth/splitter";
import Input from "@/components/auth/input";
import PasswordInput from "@/components/auth/password";
import SubmitButton from "@/components/auth/button";
import AuthFooter from "@/components/auth/AuthFooter";
import SignupPill from "@/components/auth/SignupPill";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<ReactElement>();

  async function verifyEmail(email: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      router.push("/verify-email");
    } else {
      const error = await response.json();
      setErrorMessage(<p>{error.message}</p>);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      const error = await response.json();
      if (error.message === "Email not verified") {
        verifyEmail(email);
      } else {
        setErrorMessage(<p>{error.message}</p>);
      }
    }
  }

  return (
    <AuthMain>
      <Card>
        <Title>Sign in to {process.env.NEXT_PUBLIC_APP_NAME}</Title>
        <Description>Welcome back! Please sign in to continue</Description>

        <AuthError className="mt-4 mb-4">{errorMessage}</AuthError>

        <OAuthProviders className="mt-4 mb-4" />
        <Splitter />

        <form onSubmit={handleSubmit}>
          <label className="mb-2 text-sm" htmlFor="">
            Email Address
          </label>

          <Input
            name="email"
            type="email"
            required
            autoCapitalize="none"
            autoCorrect="off"
          ></Input>

          <div className="flex justify-between">
            <label className="mb-2 text-sm" htmlFor="">
              Password
            </label>
            <Link className="text-sm text-blue-500 h-6" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <PasswordInput className="mb-8" />

          <SubmitButton />
        </form>
      </Card>

      <SignupPill />

      <AuthFooter />
    </AuthMain>
  );
}
