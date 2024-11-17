"use client"

import React from "react";
import { auth } from "../utils/auth-client.ts";

export default function Forge() {
  // Get user session
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = auth.useSession();

  // TODO: Handle errors
  console.log("Session Data:", session);
  console.log("Loading State:", isPending);
  console.log("Error:", error);

  return (
    <main>
      <div className="p-4">
        <h1>Forge</h1>
        <p>{JSON.stringify(session?.session.userId)}</p>
      </div>
    </main>
  );
}
