"use client";

import { useState, useEffect, useRef } from "react";
import { Game, Player, Room, Item } from "@/lib/engine";

interface SavedGameState {
  player: {
    health: number;
    inventory: Item[];
    currentRoomId: string;
  };
  roomInventories: { [roomId: string]: Item[] };
  stack: string[];
}

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

export default function GamePlayer({ gameData, id }: { gameData: GameData, id: string }) {
  const [game, setGame] = useState<Game | null>(null);
  const [output, setOutput] = useState<string[][]>([]);
  const [input, setInput] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameData) return;

    const roomMap: Map<string, Room> = new Map();

    // Initialize all room without connections
    gameData.rooms.forEach((roomData) => {
      const room = new Room(roomData.id, roomData.description, [
        ...roomData.inventory,
      ]);
      roomMap.set(roomData.id, room);
    });

    // Parse all the room connections
    gameData.rooms.forEach((roomData) => {
      const room = roomMap.get(roomData.id);
      if (room) {
        for (const [direction, connectedRoomId] of Object.entries(
          roomData.connections || {},
        )) {
          const connectedRoom = roomMap.get(connectedRoomId);
          if (connectedRoom) {
            room.connections[direction] = connectedRoom;
          }
        }
      }
    });

    let loadedSuccessfully = false;
    const savedGameJson = localStorage.getItem(id);

    if (savedGameJson) {
      try {
        const savedState: SavedGameState = JSON.parse(savedGameJson);

        // Validate essential parts of saved state
        if (
          savedState.player &&
          savedState.player.currentRoomId &&
          savedState.roomInventories
        ) {
          // Restore room inventories from saved state
          Object.entries(savedState.roomInventories).forEach(
            ([roomId, inventory]) => {
              const room = roomMap.get(roomId);
              if (room) {
                room.inventory = inventory;
              }
            },
          );

          // Find the player's starting room from the saved state
          const playerCurrentRoom = roomMap.get(
            savedState.player.currentRoomId,
          );

          if (playerCurrentRoom) {
            // Create player with saved data
            const player = new Player(
              savedState.player.health,
              playerCurrentRoom,
              savedState.player.inventory,
            );

            const gameInstance = new Game(Array.from(roomMap.values()), player);
            gameInstance.stack = savedState.stack || []; // Use empty array if stack wasn't saved

            setGame(gameInstance);
            setOutput([["Game loaded."], [`${playerCurrentRoom.description}`]]);
            loadedSuccessfully = true;
            console.log("Game loaded from localStorage.");
          } else {
            console.log(
              "Could not find player's current room from saved state:",
              savedState.player.currentRoomId,
            );
            localStorage.removeItem(id); // Clear corrupted save
          }
        } else {
          console.log("Saved game state is missing required fields.");
          localStorage.removeItem(id); // Clear corrupted save
        }
      } catch (error) {
        console.log(
          "Failed to parse or load game state from localStorage:",
          error,
        );
        localStorage.removeItem(id); // Clear potentially corrupted data
      }
    }

    if (!loadedSuccessfully) {
      console.log("Starting a new game.");
      const startingRoomData = gameData.rooms[0];
      const startingRoom = startingRoomData
        ? roomMap.get(startingRoomData.id)
        : undefined;
      if (startingRoom) {
        const player = new Player(100, startingRoom);
        const gameInstance = new Game(Array.from(roomMap.values()), player);
        setGame(gameInstance);
        setOutput([[`${startingRoom.description}`]]);
      } else {
        console.error("Could not determine starting room for new game.");
        // TODO: Handle error state, maybe show an error message to the user
        setOutput([["Error: Could not initialize game."]]);
      }
    }
  }, [gameData, id]);

  // --- Save Game State on Change ---
  useEffect(() => {
    if (game) {
      try {
        const gameStateToSave = game.getSaveState();
        const jsonState = JSON.stringify(gameStateToSave);
        localStorage.setItem(id, jsonState);
        console.log("Game state saved.");
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    }
  }, [game, id, output]);

  // --- Smooth scroll on new message ---
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
