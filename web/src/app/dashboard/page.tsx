'use client';

/**
 * Dashboard Component
 * 
 * Main interface for managing games. Features include:
 * - Game listing with visibility controls
 * - Sharing functionality
 * - Game deletion
 * - Create new game option
 */

import { useEffect, useState } from 'react';
import ShareModal from '../components/ShareModal';
import TestGameModal from '../components/TestGameModal';
import Link from 'next/link';

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
 * @property visibility - Current visibility status of the game
 */
interface Game {
  id: string;
  name: string;
  data: GameData;
  visibility: 'public' | 'private';
}

/**
 * Props for the VisibilityToggle component
 * @property visibility - Current visibility state
 * @property onToggle - Callback function when visibility is toggled
 * @property className - Optional CSS classes
 */
interface VisibilityToggleProps {
  visibility: 'public' | 'private';
  onToggle: () => void;
  className?: string;
}

/**
 * Button component for toggling game visibility
 * Provides visual feedback of current visibility state
 */
const VisibilityToggle: React.FC<VisibilityToggleProps> = ({ visibility, onToggle, className = '' }) => (
  <button
    onClick={onToggle}
    className={`px-2 py-1 rounded-md text-sm font-medium ${
      visibility === 'public'
        ? 'bg-green-100 text-green-800 hover:bg-green-200'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    } ${className}`}
    title={`Game is ${visibility}. Click to toggle visibility.`}
  >
    {visibility === 'public' ? 'Public' : 'Private'}
  </button>
);

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    // Mock games data for development demo
    const mockGames: Game[] = [
      {
        id: '1',
        name: 'Adventure Quest',
        visibility: 'private',
        data: {
          difficulty: 'medium',
          settings: {
            maxPlayers: 4,
            timeLimit: 3600,
            checkpoints: true
          }
        }
      },
      {
        id: '2',
        name: 'Space Explorer',
        visibility: 'public',
        data: {
          difficulty: 'hard',
          settings: {
            maxPlayers: 2,
            timeLimit: 7200,
            specialItems: ['jetpack', 'laser']
          }
        }
      },
      {
        id: '3',
        name: 'Puzzle Master',
        visibility: 'private',
        data: {
          difficulty: 'easy',
          settings: {
            maxPlayers: 1,
            timeLimit: 1800,
            hints: true
          }
        }
      }
    ];
    setGames(mockGames);
    setLoading(false);
  }, []);

  /**
   * Handles the deletion of a game
   * Shows confirmation dialog and provides error feedback
   * @param gameId - ID of the game to delete
   */
  const handleDelete = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      // Remove game from state
      setGames(games.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Failed to delete game:', error);
      setError('Failed to delete game');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Games</h1>
          <Link
            href="/game/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Game
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {games.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You have not created any games yet.</p>
            <Link
              href="/game/new"
              className="text-blue-600 hover:text-blue-800"
            >
              Create your first game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {game.name}
                  </h2>
                  <div className="flex space-x-2">
                    <VisibilityToggle
                      visibility={game.visibility}
                      onToggle={async () => {
                        try {
                          const newVisibility = game.visibility === 'public' ? 'private' : 'public';
                          // await fetch(`/api/games/${game.id}/visibility`, {
                          //   method: 'PATCH',
                          //   body: JSON.stringify({ visibility: newVisibility }),
                          // });
                          
                          setGames(games.map(g => 
                            g.id === game.id 
                              ? { ...g, visibility: newVisibility }
                              : g
                          ));
                        } catch (error) {
                          console.error('Failed to update visibility:', error);
                          setError('Failed to update game visibility');
                        }
                      }}
                    />
                    <div className="flex space-x-2">
                      <Link
                        href={`/game/${game.id}`}
                        className="text-gray-400 hover:text-gray-500"
                        title="Edit game"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Delete game"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <pre className="text-sm text-gray-600 overflow-hidden max-h-24">
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
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
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
    </div>
  );
}
