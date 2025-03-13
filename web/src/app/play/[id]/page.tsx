"use client";

import { useState, useEffect } from "react";
import GamePlayer from "@/components/GamePlayer";
import { notFound } from "next/navigation";
import Navbar from "@/components/NavBar";
import QRCode from 'qrcode';
import Link from 'next/link';



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
  const getRandomColor = () => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  
  
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [dotColor, setDotColor] = useState(getRandomColor());
  const [secondColor, setSecondColor] = useState(getRandomColor());

  useEffect(() => {
    setDotColor(getRandomColor());
    setSecondColor(getRandomColor());
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      const id = (await params).id;

      try {
        const gameResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games/${id}`,
          { method: "GET" },
        );

        if (!gameResponse.ok) {
          throw new Error("Game data not found"); // TODO: Error message
        }

        const game = await gameResponse.json();
        setGameData(game);
        console.log("g",game)

          // Generate QR code
          const gameUrl = `${window.location.origin}/play/${id}`;
          const qrCode = await QRCode.toDataURL(gameUrl, {
            width: 400,
            margin: 1,
            errorCorrectionLevel: 'H',
            color: {
              dark: dotColor, // U,
              light: '#FFFFFF',
            }
          });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = 400;
            canvas.height = 400;
            ctx?.drawImage(img, 0, 0);
            
            if (ctx) {
              ctx.font = 'bold 36px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const text = 'Texterra';
              const textWidth = ctx.measureText(text).width;
              ctx.fillStyle = 'white';
              ctx.fillRect(
                (canvas.width - textWidth) / 2 - 10,
                canvas.height / 2 - 20,
                textWidth + 20,
                40
              );
              
              // Create gradient for text
              const gradient = ctx.createLinearGradient(
                (canvas.width - textWidth) / 2,
                canvas.height / 2,
                (canvas.width + textWidth) / 2,
                canvas.height / 2
              );
              gradient.addColorStop(0, dotColor);
              gradient.addColorStop(1, secondColor);
              
              ctx.fillStyle = gradient;
              ctx.fillText('Texterra', canvas.width/2, canvas.height/2);
            }
            
            setQrCodeUrl(canvas.toDataURL());
          };
          
          img.src = qrCode;





      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
    console.log(params)
    
  }, [params]);

  // Return error if data isn't available after loading
  if (!loading && !gameData) {
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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {!isPlaying ? (
        <>
          <Navbar />
          <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
            <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-20" 
                style={{
                background: `
                      radial-gradient(circle at 1px 1px, 
          ${dotColor} 1px, 
          transparent 0
        ),
        linear-gradient(to right, #374151, #ffffff)
      `,
      backgroundSize: '40px 40px, 100% 100%'
    }}
  />
            </div>
            
            <div className="relative z-10 container mx-auto px-4">
              <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Game Information */}
                  <div className="space-y-6">
                    <div className="text-left">
                      <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-full text-sm font-medium">
                        Text Adventure Game
                      </span>
                      <h1 className="text-4xl font-bold text-white mt-4 mb-2">{gameData.name}</h1>
                      <p className="text-xl text-gray-300">Created by {gameData.author}</p>
                    </div>

                    {/* Game Image Placeholder */}
                    <div className="bg-gray-800/50 rounded-lg h-48 flex items-center justify-center">
                      <p className="text-gray-400">Game Preview Image</p>
                    </div>

                    {/* Game Description */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white text-lg mb-2">Description</h3>
                      <p className="text-gray-300">
                        Embark on an educational journey through ancient mysteries and puzzles...
                      </p>
                    </div>

                    {/* Difficulty and Rating */}
                    <div className="flex gap-4">
                      <div className="bg-white/5 rounded-lg p-4 flex-1">
                        <h3 className="text-white text-lg mb-2">Difficulty</h3>
                        <p className="text-blue-400">Intermediate</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 flex-1">
                        <h3 className="text-white text-lg mb-2">Rating</h3>
                        <div className="flex gap-1 text-blue-400">
                          <span>T</span>
                          <span>T</span>
                          <span>T</span>
                          <span>T</span>
                          <span className="text-gray-500">T</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full px-8 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all hover:shadow-xl hover:shadow-blue-600/20"
                      onClick={play}
                    >
                      Start Adventure
                    </button>
                  </div>

                   {/* Right Column - QR Code */}
        <div className="flex flex-col items-center justify-center">
    {qrCodeUrl && (
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-1 rounded-xl shadow-lg">
          <div className="bg-white p-6 rounded-xl">
            <img 
              src={qrCodeUrl} 
              alt="Game QR Code"
              className="w-64 h-64 transform transition-transform hover:scale-105"
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-300">
          Scan to share this game
        </p>
      </div>
    )}
  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <GamePlayer gameData={gameData.data} />
      )}
    </main>
  );
}


