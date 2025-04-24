"use client";

/**
 * Game Edit Page
 *
 * This page provides a form interface for editing existing games. It includes:
 * - Game name input field pre-filled with existing data
 * - JSON data input field with validation pre-filled with existing data
 * - Error handling for invalid JSON and API responses
 * - Session expiration handling
 * - Loading states during form submission and initial data fetch
 *
 * Note: This page is protected by authentication middleware.
 * Users with expired sessions will be prompted to log in again.
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditGame() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  // Form state management
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing game data when component mounts
  useEffect(() => {
    async function fetchGameData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please log in again to continue.",
            );
          } else if (response.status === 404) {
            throw new Error("Game not found");
          } else {
            throw new Error("Failed to fetch game data");
          }
        }

        const gameData = await response.json();
        setName(gameData.name);
        setData(JSON.stringify(gameData.data, null, 2));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch game data");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  // Event handlers for form inputs
  // Clear errors when user starts typing to provide immediate feedback
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
    setError("");
  };

  /**
   * Form submission handler
   * 1. Validates JSON data format
   * 2. Sends PATCH request to /api/games/:id endpoint
   * 3. Handles various response cases:
   *    - 401: User needs to authenticate
   *    - 200: Game updated successfully
   *    - Other errors: Display appropriate error message
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      // Attempt to parse JSON data before sending to API
      const parsedData = JSON.parse(data);

      // Send PATCH request to update game
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for sending cookies
          body: JSON.stringify({
            name,
            data: parsedData,
          }),
        },
      );

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please log in again to continue.",
          );
        } else if (response.status === 404) {
          throw new Error("Game not found");
        }
        throw new Error(errorData.error || "Failed to update game");
      }

      // On success, show success message and redirect to dashboard
      setError("Game updated successfully!");

      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      // Handle different types of errors
      if (err instanceof SyntaxError) {
        setError("Invalid JSON data format");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update game. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching game data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    // Main container with responsive padding
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Form container with max width for readability */}
      <div className="max-w-md mx-auto">
        {/* Form header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Game</h1>
          <p className="mt-2 text-gray-600">Update your game details below</p>
        </div>

        {/* Game edit form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Game name input field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Game Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={handleNameChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
              placeholder="Enter game name"
            />
          </div>

          {/* Game data input field - expects valid JSON */}
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-700"
            >
              Game Data (JSON)
            </label>
            <textarea
              id="data"
              required
              value={data}
              onChange={handleDataChange}
              rows={10}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-gray-900"
              placeholder='{"key": "value"}'
            />
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4">
            {/* Cancel button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Error/Success message display */}
          {error && (
            <div
              className={`mt-4 p-3 rounded ${
                error.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
