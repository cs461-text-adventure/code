"use client";

import { useState, useEffect } from "react";
import GamePlayer from "@/components/GamePlayer";
import { notFound } from "next/navigation";

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

export default function Games({ params }: { params: Promise<{ id: string }> }) {
  const [inviteData, setInviteData] = useState(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      const id = (await params).id;

      try {
        const inviteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invite/${id}`,
          { method: "GET" },
        );

        if (!inviteResponse.ok) {
          throw new Error("Invite data not found"); // TODO: Error message
        }

        const invite = await inviteResponse.json();
        setInviteData(invite);

        const gameResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/${invite.gameId}`,
          { method: "GET" },
        );

        if (!gameResponse.ok) {
          throw new Error("Game data not found"); // TODO: Error message
        }

        const game = await gameResponse.json();
        setGameData(game);
      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [params]);

  // Return error if data isn't available after loading
  if (!loading && (!gameData || !inviteData)) {
    return (
      <main className="p-4">
        <p>Game not found...</p>
      </main>
    );
  }

  if (!gameData) {
    return <p>Loading...</p>;
  }

  const play = () => {
    setIsPlaying(true);
  };

  return (
    <main>
      {!isPlaying ? (
        <div className="mx-8 pt-4">
          <div className="mb-2">
            <p className="font-bold">{gameData.name}</p>
            <p>Author: {gameData.author}</p>
            <br />
          </div>
          <button
            className="text-rg text-white w-96 bg-blue-600 hover:bg-blue-700 rounded-lg p-2"
            onClick={play}
          >
            Play
          </button>
        </div>
      ) : (
        <GamePlayer gameData={gameData.data} id={gameData.id}/>
      )}
    </main>
  );
}
