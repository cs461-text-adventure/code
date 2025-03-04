import Link from "next/link";

interface GameData {
  id: string;
  userId: string;
  name: string;
  data: JSON;
  isPublic: boolean;
  author: string;
}

export default async function Browse() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const games = data;

  return (
    <main>
      <div className="px-4">
        {games.map((game: GameData) => (
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
