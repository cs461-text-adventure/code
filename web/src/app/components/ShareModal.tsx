"use client";

/**
 * ShareModal Component
 *
 * A reusable modal component for sharing game links. Features include:
 * - Copy to clipboard functionality
 * - Keyboard support (Escape to close)
 * - Focus management
 * - Visual feedback for actions
 */

import { useEffect, useRef, useState } from "react";

/**
 * Props for the ShareModal component
 * @property isOpen - Controls the visibility of the modal
 * @property onClose - Callback function to handle modal closure
 * @property gameId - Unique identifier of the game being shared
 * @property gameName - Display name of the game
 */
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameName: string;
}

/**
 * A modal component for sharing game links
 * Provides a user interface for copying and sharing game URLs
 */
export default function ShareModal({
  isOpen,
  onClose,
  gameId,
  gameName,
}: ShareModalProps) {
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameId: gameId,
              expiration: 86400, // TODO: change expiration (default 24hrs)
            }),
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`); // TODO: Change error
        }

        const data = await response.json();
        setGameUrl(data);
      } catch (error) {
        console.error("Failed to fetch invite:", error); // TODO: Change error
      }
    }

    if (isOpen && !gameUrl) {
      fetchInvite();
    }
  }, [isOpen, gameId, gameUrl]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!gameUrl) return null; // TODO: Change error behavior

  /**
   * Handles copying the game URL to clipboard
   * Shows a temporary success message upon successful copy
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
      // Show success message
      const el = document.createElement("div");
      el.className =
        "fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-lg z-50";
      el.textContent = "Game link copied to clipboard!";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="dark:bg-slate-900 bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Share &quot;{gameName}&quot;
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Game Link
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={gameUrl}
              className="dark:bg-gray-800 p-2 flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
