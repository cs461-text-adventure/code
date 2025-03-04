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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
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

  if (loading) return <p>Loading games...</p>; // TODO: Add skeleton instead
  if (!games || games.length === 0) return <p>No games found.</p>; // TODO: Unexpected behavior

  return (
    <main>
      <div className="px-4">
        {games.map((game) => (
          <Link
            key={game.id}
            className="hover:shadow-md"
            href={`/play/${game.id}`}
          >
            <div className="p-4 w-fit rounded-lg dark:bg-slate-900 bg-white text-md border border-gray-300 dark:border-gray-800">
              <h3 className="font-bold">{game.name}</h3>
              <p>Author: {game.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
