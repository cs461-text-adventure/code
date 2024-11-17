'use client'

import React from "react";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { auth } from "../utils/auth-client.ts";
import dynamic from 'next/dynamic'

const Sessions = dynamic(() => import('../components/sessions.tsx'), { ssr: false })
import Sidebar from "../components/sidebar.tsx";

export default function Settings() {
  const [currentSession, setCurrentSession] = useState<any>(); // TODO: FIX TYPE
  const [profile, setProfile] = useState<any>(); // TODO: FIX TYPE

  const getCurrentSession = async () => {
    const currentSessionData = await auth.getSession();
    console.log("currentSession", currentSessionData);
    setCurrentSession(currentSessionData);
  }

  // Fetch the session when the component mounts
  useEffect(() => {
    getCurrentSession();
  }, []);

  useEffect(() => {
    if (currentSession !== undefined) {
      console.log("USERNAME:", currentSession.data.user.name);
      const imageURL = currentSession?.data?.user?.image ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg";

      setProfile (
        <div>
          {/* TODO: Write ALT tags for images */}
          <img src={imageURL} alt="User Profile" className="rounded-full w-8 h-8 border border-gray-300"/>
        </div>
      )
    }
  }, [currentSession]);

  console.log();

  return (
    <main className="bg-[#fafafa] text-black min-w-80">
      
      <div className="bg-white p-4 text-xl font-semibold border-b-gray-200 border flex flex-row justify-between items-center">
        <h1>Settings</h1>
        <div className="flex flex-col items-end">
          {profile}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:p-4 md:gap-4">
        <Sidebar />
        <div className="flex-2 md:w-[75%]">
          <div className="p-4 border border-gray-200 md:rounded-lg bg-white">
            <p className="mb-4 bold font-semibold">
              Logged in sessions
            </p>
            <Suspense fallback={<p>Loading sessions...</p>}>
              <Sessions />
            </Suspense>
          </div>

          {/* Only allow revocation of sessions that are NOT logged into */}

          {/* TODO: ADD PASSKEY TABLE AND REGISTRATION/REVOCATIION */}

          {/* TODO: ADD TOTP TABLE AND ENABLE/DISABLE */}
        </div>
      </div>
    </main>
  );
}
