"use client";

import React from "react";
import { useEffect, useState } from "react";
import { auth } from "../utils/auth-client.ts";
import { UAParser } from "ua-parser-js";
import type { Session } from "better-auth/types";

type IResult = {
  ua: "";
  browser: {
    name: "";
    version: "";
    major: "";
  };
  cpu: {
    architecture: "";
  };
  device: {
    type: "";
    vendor: "";
    model: "";
  };
  engine: {
    name: "";
    version: "";
  };
  os: {
    name: "";
    version: "";
  };
};

export default function Sessions() {
  // TODO: FIX TYPES
  const [currentSession, setCurrentSession] = useState<any>();
  const [sessions, setSessions] = useState<any>();

  // Fetch the sessions and current session
  const fetchSessions = async () => {
    const sessionsData = await auth.listSessions();
    const currentSessionData = await auth.getSession();

    let updatedSessionsData = [];
    for (const session of Object.values(sessionsData!.data!)) {
      if (
        (session as { id: string }).id !== currentSessionData!.data!.session.id
      ) {
        updatedSessionsData.push(session);
      }
    }
    updatedSessionsData.unshift(currentSessionData.data);

    // TODO: Ensure we have valid data
    if (!sessionsData?.data || !currentSessionData?.data?.session) {
      console.error("Invalid session data");
      return;
    }

    setSessions({'data': updatedSessionsData});
    setCurrentSession(currentSessionData);
  };

  // Revoke session logic
  async function revokeSession(session: Session) {
    try {
      await auth.revokeSession({ id: session.id });

      // After revoking the session, re-fetch the sessions to update the state
      const updatedSessions = await auth.listSessions();
      setSessions(updatedSessions);
    } catch (error) {
      console.error("Failed to revoke session", error);
      // TODO: Handle the error appropriately
    }
  }

  // Fetch the sessions when the component mounts
  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      {sessions?.data && (
        <div className="session-list">
          {/* TODO: ASDASDASD */}

          {/* TODO: ASDASDASD */}


          {sessions.data.map((session: any, index: number) => {
            const parser = new UAParser(session.userAgent || "");
            const result = parser.getResult?.() as IResult;
            const backgroundStyle = index % 2 === 0
              ? "bg-[#f6f7f8] rounded-lg"
              : "bg-white";
            return (
              <div
                key={session.id}
                className={`session-item p-2 ${backgroundStyle}`}
              >
                <div className="flex justify-between items-center">
                  <p>{result.browser.name ? result.browser.name : result.ua}</p>
                  <div className="flex items-center gap-2">
                    {index === 0
                      ? <p className="text-white border border-green-700 rounded-lg text-xs pr-2 pl-2 pt-1 pb-1 bg-green-700">Current session</p>
                      : (
                        <button
                          className="text-red-700 border border-gray-300 rounded-lg text-xs pr-2 pl-2 pt-1 pb-1 hover:bg-red-700 hover:border-red-700 hover:text-white"
                          onClick={() => revokeSession(session)}
                        >
                          Revoke session
                        </button>
                      )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      {session.ipAddress || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-500 mr-1">
                      {result.os.name} {result.os.version}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
