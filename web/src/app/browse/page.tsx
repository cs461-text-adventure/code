"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface Item {
  id: string;
  name: string;
  description: string;
}

interface Game {
  id: string;
  name: string;
  isPublic: boolean;
  author: string;
}

export default function Browse() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const size = Number(searchParams.get("size") ?? 100);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/games?page=${page}&size=${size}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setGames(data.data);
        setPagination(data.meta);
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
  }, [page, size]);

  if (loading) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <p className="text-gray-500 text-center">Loading games...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-center mb-4">Browse Games</h1>
          <div className="p-3 rounded-lg bg-red-600/25 text-red-700 dark:text-red-500 border border-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!games || games.length === 0) {
    return (
      <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
        <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-center mb-4">Browse Games</h1>
          <p className="text-gray-500 text-center">No public games found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="md:flex md:bg-gray-50 md:items-start md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="md:rounded-3xl dark:bg-slate-900 bg-white md:border border-gray-300 dark:border-gray-800 p-6 mb-6">
          
          <div className="flex flex-row">
            <h1 className="text-2xl font-bold mb-6">Browse Games</h1>

            {/* Pagination Controls */}
            <div className="flex space-x-2 mb-6 items-center ml-auto">
              {/* First Page */}
              {page > 2 && (
                <>
                  <Link
                    href={`/browse?page=1&size=${size}`}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                  >
                    1
                  </Link>
                  <span className="px-2 text-gray-500">...</span>
                </>
              )}

              {/* Page - 1 */}
              {page > 1 && (
                <Link
                  href={`/browse?page=${page - 1}&size=${size}`}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  {page - 1}
                </Link>
              )}

              {/* Current Page */}
              <span className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold shadow">
                {page}
              </span>

              {/* Page + 1 */}
              {page + 1 <= pagination.totalPages && (
                <Link
                  href={`/browse?page=${page + 1}&size=${size}`}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  {page + 1}
                </Link>
              )}

              {/* Last Page */}
              {page + 1 < pagination.totalPages && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <Link
                    href={`/browse?page=${pagination.totalPages}&size=${size}`}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                  >
                    {pagination.totalPages}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link key={game.id} className="block" href={`/play/${game.id}`}>
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
