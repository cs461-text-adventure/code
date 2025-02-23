"use client";

/**
 * Game Creation Form Component
 *
 * This component provides a form interface for creating new games. It includes:
 * - Game name input field
 * - JSON data input field with validation
 * - Error handling for invalid JSON and API responses
 * - Authentication state handling
 * - Loading states during form submission
 *
 * The form integrates with the backend API and requires authentication to create games.
 * If a user is not authenticated, they are prompted to sign in.
 */

import { useState } from "react";
import Link from "next/link";

export default function NewGame() {
  // Form state management
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
   * 2. Sends POST request to /api/games endpoint
   * 3. Handles various response cases:
   *    - 401: User needs to authenticate
   *    - 200: Game created successfully
   *    - Other errors: Display appropriate error message
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Attempt to parse JSON data before sending to API
      const parsedData = JSON.parse(data);

      // Send POST request to create game
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({
          name,
          data: parsedData,
        }),
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error("Please sign in to create a game");
        }
        throw new Error(errorData.error || "Failed to create game");
      }

      // On success, clear form and show success message
      const newGame = await response.json();
      setName("");
      setData("");
      setError("Game created successfully!");
    } catch (err) {
      // Handle different types of errors
      if (err instanceof SyntaxError) {
        setError("Invalid JSON data format");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create game. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container with responsive padding
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Sign in button - positioned in top right corner */}
      <div className="absolute top-4 right-4">
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </Link>
      </div>
      {/* Form container with max width for readability */}
      <div className="max-w-md mx-auto">
        {/* Form header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Game</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to create a new game
          </p>
        </div>

        {/* Game creation form */}
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
              rows={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-gray-900"
              placeholder='{"key": "value"}'
            />
          </div>

          {/* Submit button with loading state */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? "Creating..." : "Create Game"}
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
