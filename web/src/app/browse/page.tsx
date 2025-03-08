"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface Item {
  id: string;
  name: string;
  description: string;
}

interface GameData {
  rooms: [
    {
      id: string;
      description: string;
      inventory: Item[];
      connections: [string, string];
    },
  ];
}
// TODO: Move typing into seperate file
interface Game {
  id: string;
  userId: string;
  name: string;
  data: GameData;
  isPublic: boolean;
  author: string;
}

export default function Browse() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unexpected error occurred:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <p className="text-gray-500 text-center">Loading games...</p>
        </div>
      </main>
    );
  }

  if (!games || games.length === 0) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-center mb-4">Browse Games</h1>
          <p className="text-gray-500 text-center">No games found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="md:flex md:bg-gray-50 md:items-start md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="md:rounded-3xl dark:bg-slate-900 bg-white md:border border-gray-300 dark:border-gray-800 p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Browse Games</h1>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link
                key={game.id}
                className="block"
                href={`/play/${game.id}`}
              >
                <div className="p-4 rounded-lg dark:bg-slate-900 bg-white border border-gray-300 dark:border-gray-800 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  <p className="text-gray-500 mt-2">Author: {game.author}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Play Game
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
