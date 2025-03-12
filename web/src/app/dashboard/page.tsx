"use client";

/**
 * Dashboard Component
 *
 * Main interface for managing games. Features include:
 * - Game listing with visibility controls
 * - Sharing functionality
 * - Game deletion
 * - Create new game option
 */

import { useEffect, useState } from "react";
import ShareModal from "../components/ShareModal";
import TestGameModal from "../components/TestGameModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Represents the structure of game data
 */
interface GameData {
  difficulty: string;
  settings: Record<string, unknown>;
}

/**
 * Represents a complete game entity
 * @property id - Unique identifier for the game
 * @property name - Display name of the game
 * @property data - Game configuration and settings
 * @property isPublic - Current visibility status of the game
 */
interface Game {
  id: string;
  name: string;
  data: GameData;
  isPublic: boolean;
  userId: string;
}

/**
 * Props for the VisibilityToggle component
 * @property isPublic - Current visibility state
 * @property onToggle - Callback function when visibility is toggled
 * @property className - Optional CSS classes
 */
interface VisibilityToggleProps {
  isPublic: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Button component for toggling game visibility
 * Provides visual feedback of current visibility state
 */
const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  isPublic,
  onToggle,
  className = "",
}) => (
  <button
    onClick={onToggle}
    className={`px-2 py-1 rounded-md text-sm font-medium ${
      isPublic
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    } ${className}`}
    title={`Game is ${isPublic ? "public" : "private"}. Click to toggle visibility.`}
  >
    {isPublic ? "Public" : "Private"}
  </button>
);

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);

  const router = useRouter();

  async function logout() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to log out"); // TODO: error message
      }
      router.push("/login");
    } catch (error) {
      // TODO: error handling setErrorMesssage()
      console.error("Logout error:", error); // TODO: error message
    }
  }

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/me`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to view your games");
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setGames(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Failed to fetch games:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  /**
   * Handles the deletion of a game
   * Shows confirmation dialog and provides error feedback
   * @param gameId - ID of the game to delete
   */
  const handleDelete = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You must be logged in to delete games");
        } else if (response.status === 403) {
          throw new Error("You do not have permission to delete this game");
        } else if (response.status === 404) {
          throw new Error("Game not found");
        }
        throw new Error("Failed to delete game");
      }

      // Remove game from state
      setGames(games.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to delete game:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete game");
      }
    }
  };

  /**
   * Handles toggling the visibility of a game
   * @param gameId - ID of the game to update
   * @param currentVisibility - Current visibility state
   */
  const handleToggleVisibility = async (
    gameId: string,
    currentVisibility: boolean,
  ) => {
    try {
      const newVisibility = !currentVisibility;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isPublic: newVisibility }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You must be logged in to update games");
        } else if (response.status === 403) {
          throw new Error("You do not have permission to update this game");
        } else if (response.status === 404) {
          throw new Error("Game not found");
        }
        throw new Error("Failed to update game visibility");
      }

      // Update game in state
      setGames(
        games.map((game) =>
          game.id === gameId ? { ...game, isPublic: newVisibility } : game,
        ),
      );
    } catch (error) {
      console.error("Failed to update visibility:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update game visibility");
      }
    }
  };

  if (loading) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <p className="text-gray-500 text-center">Loading games...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="md:flex md:bg-gray-50 md:items-start md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Logout Button */}
        <div className="flex justify-end px-6 md:p-0">
          <button
            onClick={logout}
            className="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 mb-4"
          >
            Logout
          </button>
        </div>

        <div className="md:rounded-3xl dark:bg-slate-900 bg-white md:border border-gray-300 dark:border-gray-800 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Games</h1>
            <Link
              href="/game/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Game
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-600/25 text-red-700 dark:text-red-500 border border-red-600">
              {error}
            </div>
          )}

          {games.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You have not created any games yet.
              </p>
              <Link href="/game/new" className="text-blue-500 hover:underline">
                Create your first game
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="dark:bg-slate-900 bg-white border border-gray-300 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">{game.name}</h2>
                    <div className="flex space-x-2">
                      <VisibilityToggle
                        isPublic={game.isPublic}
                        onToggle={() =>
                          handleToggleVisibility(game.id, game.isPublic)
                        }
                      />
                      <div className="flex space-x-2">
                        <Link
                          href={`/game/${game.id}`}
                          className="text-gray-400 hover:text-gray-500"
                          title="Edit game"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedGame(game);
                            setShareModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                          title="Share game"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete game"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <pre className="text-sm text-gray-600 overflow-hidden max-h-24 dark:bg-black p-2 rounded-lg">
                      {JSON.stringify(game.data, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedGame(game);
                          setTestModalOpen(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                      >
                        Test Game
                      </button>
                      <Link
                        href={`/play/${game.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Play Game
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedGame && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedGame(null);
          }}
          gameId={selectedGame.id}
          gameName={selectedGame.name}
        />
      )}
      {selectedGame && (
        <TestGameModal
          isOpen={testModalOpen}
          onClose={() => {
            setTestModalOpen(false);
            setSelectedGame(null);
          }}
          gameId={selectedGame.id}
          gameName={selectedGame.name}
        />
      )}
    </main>
  );
}
