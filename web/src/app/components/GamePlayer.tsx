"use client";

import { useState, useEffect, useRef } from "react";
import { Game, Player, Room, Item } from "@/lib/engine";

// TODO: Replace this with some typing in a lib file
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

export default function GamePlayer({ gameData }: { gameData: GameData }) {
  const [game, setGame] = useState<Game | null>(null);
  const [output, setOutput] = useState<string[][]>([]);
  const [input, setInput] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // TODO: move into engine . add localStorage
  // function setupGame() {}

  useEffect(() => {
    if (gameData) {
      const roomMap: Map<string, Room> = new Map();

      // Initialize all room without connections
      gameData.rooms.forEach((roomData) => {
        const room = new Room(
          roomData.id,
          roomData.description,
          roomData.inventory,
        );
        roomMap.set(roomData.id, room);
      });

      // Parse all the room connections
      gameData.rooms.forEach((roomData) => {
        const room = roomMap.get(roomData.id);
        if (room) {
          for (const [direction, connectedRoomId] of Object.entries(
            roomData.connections,
          )) {
            const connectedRoom = roomMap.get(connectedRoomId);
            if (connectedRoom) {
              room.connections[direction] = connectedRoom;
            }
          }
        }
      });

      const startingRoom = roomMap.get(gameData.rooms[0].id);
      if (startingRoom) {
        const player = new Player(100, startingRoom);
        const gameInstance = new Game(Array.from(roomMap.values()), player);
        setGame(gameInstance);
        setOutput([[`${startingRoom.description}`]]);
      }
    }
  }, [gameData]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  if (!game) return <p>Loading game...</p>;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // HANDLES USER INTERACTION
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && input.trim() !== "") {
      const newInteraction = [`> ${input}`, ...game.nextStep(input)];
      setOutput((prev) => [...prev, newInteraction]);
      setInput("");
    }
  };

  return (
    <main className="flex flex-col h-screen dark:bg-gray-900 dark:text-white bg-[#f9f9f9]">
      {/* Chat output container */}
      <div className="flex-1 overflow-y-auto p-4 font-mono">
        <div className="flex-1 overflow-y-auto p-4 mb-8">
          {/* TODO: Display output */}
          {output.map((interaction, i) => (
            <div key={i} className="mb-4">
              {interaction.map((msg, j) => (
                <p
                  key={j}
                  className="mb-1"
                  ref={
                    i === output.length - 1 && j === interaction.length - 1
                      ? lastMessageRef
                      : null
                  }
                >
                  {msg}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Input bar at the bottom */}
      <div className="p-4 border-t dark:border-gray-700 dark:bg-gray-800">
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          className="
                        dark:border-gray-800 
                        border
                        border-gray-300
                        p-2 
                        rounded-lg 
                        w-full
                        dark:text-white
                        dark:bg-gray-900
                        focus:outline-none
                    "
          placeholder="Type a command..."
        />
      </div>
    </main>
  );
}
