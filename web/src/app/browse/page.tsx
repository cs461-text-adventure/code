'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GameSettings {
  maxPlayers: number;
  timeLimit: number;
}

interface GameData {
  difficulty: string;
  settings: GameSettings;
}

interface Game {
  id: string;
  name: string;
  data: GameData;
  isPublic: boolean;
}

export default function BrowseGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicGames = async () => {
      try {
        const response = await fetch('/api/games/public');
        if (!response.ok) {
          throw new Error('Failed to fetch public games');
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicGames();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Loading games...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Error</h1>
            <p className="mt-4 text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Browse Games</h1>
          <p className="mt-2 text-gray-600">Discover public text adventures</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Difficulty: {game.data.difficulty}
                  </p>
                  <p className="text-sm text-gray-500">
                    Max Players: {game.data.settings.maxPlayers}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time Limit: {game.data.settings.timeLimit} seconds
                  </p>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/game/${game.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Play Game
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {games.length === 0 && (
            <div className="col-span-full text-center">
              <p className="text-gray-500">No public games available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
