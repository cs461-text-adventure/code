"use client";
import React from "react";
import { auth } from "../utils/auth-client.ts"; //import the auth client
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const signUp = async () => {
    const { data, error } = await auth.signUp.email({
      email,
      password,
      name,
      image: undefined,
    }, {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  return (
    <div>
      <input
        className="text-black p-2 rounded-md"
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="text-black p-2 rounded-md"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="text-black p-2 rounded-md"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}
