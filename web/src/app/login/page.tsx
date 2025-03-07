"use client";

import { FormEvent, useState, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthMain from "@/components/auth/AuthMain";
import Card from "@/components/auth/card";
import Title from "@/components/auth/title";
import Description from "@/components/auth/description";
import AuthError from "@/components/auth/error";
import OAuthProviders from "@/components/auth/OAuthProviders";
import Splitter from "@/components/auth/splitter";
import AuthFooter from "@/components/auth/AuthFooter";
import SignupPill from "@/components/auth/SignupPill";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<ReactElement>();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        setErrorMessage(<p>{error.message || 'Invalid email or password'}</p>);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(<p>Login failed. Please try again.</p>);
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

          <input
            type="email"
            name="email"
            required
            autoCapitalize="none"
            autoCorrect="off"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
          />

          <div className="flex justify-between">
            <label className="mb-2 text-sm" htmlFor="">
              Password
            </label>
            <Link className="text-sm text-blue-500 h-6" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            className="mt-1 mb-8 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
          />

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </form>
      </Card>

      <SignupPill />

      <AuthFooter />
    </AuthMain>
  );
}
