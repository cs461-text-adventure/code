"use client";

/**
 * TestGameModal Component
 *
 * A modal component for testing games before publishing.
 * Provides a preview of the game with test controls and feedback.
 */

import { useEffect, useRef, useState } from "react";

/**
 * Props for the TestGameModal component
 * @property isOpen - Controls the visibility of the modal
 * @property onClose - Callback function to handle modal closure
 * @property gameId - Unique identifier of the game being tested
 * @property gameName - Display name of the game
 */
interface TestGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameName: string;
}

/**
 * A modal component for testing game functionality
 * Provides an interface for testing game mechanics and configurations
 */
export default function TestGameModal({
  isOpen,
  onClose,
  gameId,
  gameName,
}: TestGameModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Initialize test environment
      setTestOutput([
        "Test environment initialized...",
        `Loading game: ${gameName} (ID: ${gameId})`,
      ]);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, gameName, gameId]);

  if (!isOpen) return null;

  /**
   * Handles test command submission
   * Processes the command and updates the test output
   */
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add command to output
    setTestOutput((prev) => [...prev, `> ${command}`]);

    // Process command with game context
    const response = `Executing command "${command}" for game ${gameId}...`;
    setTestOutput((prev) => [...prev, response]);

    // Clear command input
    setCommand("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
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
          Testing &quot;{gameName}&quot;
        </h2>

        <div className="mb-6">
          <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto text-gray-100 font-mono text-sm">
            {testOutput.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="mt-4">
            <div className="flex">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter test command..."
                className="flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-l-0 border-transparent rounded-r-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Run
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              setTestOutput((prev) => [
                ...prev,
                "Resetting test environment...",
                "Test environment initialized...",
                `Loading game: ${gameName} (ID: ${gameId})`,
              ]);
            }}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Test
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
