"use client";

import { Suspense, useEffect, useState } from "react"; // Import Suspense
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

function BrowseContent() {
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
      setError(null);
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
        if (data && data.data && data.meta) {
            setGames(data.data);
            setPagination(data.meta);
        } else {
            throw new Error("Invalid API response structure");
        }

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
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0">Browse Games</h1>

            {/* Pagination Controls - Conditionally render if more than one page */}
            {pagination.totalPages > 1 && (
                <div className="flex flex-wrap space-x-2 items-center justify-center sm:justify-end">
                {/* First Page & Ellipsis */}
                {page > 2 && (
                    <>
                    <Link
                        href={`/browse?page=1&size=${size}`}
                        className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                        1
                    </Link>
                    {page > 3 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
                    </>
                )}

                {/* Previous Page */}
                {page > 1 && (
                    <Link
                    href={`/browse?page=${page - 1}&size=${size}`}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                    {page - 1}
                    </Link>
                )}

                {/* Current Page */}
                <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-600 text-white font-semibold shadow text-sm sm:text-base">
                    {page}
                </span>

                {/* Next Page */}
                {page < pagination.totalPages && (
                    <Link
                    href={`/browse?page=${page + 1}&size=${size}`}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                    {page + 1}
                    </Link>
                )}

                {/* Last Page & Ellipsis */}
                {page < pagination.totalPages - 1 && (
                    <>
                    {page < pagination.totalPages - 2 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
                    <Link
                        href={`/browse?page=${pagination.totalPages}&size=${size}`}
                        className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                        {pagination.totalPages}
                    </Link>
                    </>
                )}
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link key={game.id} className="block group" href={`/play/${game.id}`}>
                <div className="p-4 rounded-lg dark:bg-slate-800 bg-gray-50 border border-gray-300 dark:border-gray-700 group-hover:shadow-md group-hover:border-blue-500 dark:group-hover:border-blue-600 transition-all duration-200 h-full flex flex-col">
                  <h3 className="font-bold text-lg mb-1 truncate">{game.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Author: {game.author}</p>
                  <div className="mt-auto flex justify-end">
                    <span className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 group-hover:bg-blue-700 transition-colors duration-200">
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

function LoadingFallback() {
    return (
        <main className="md:flex md:bg-gray-50 md:items-center md:justify-center min-h-screen min-w-64 dark:bg-slate-900 dark:md:bg-gray-950">
            <div className="px-8 pt-4 md:pt-8 md:pb-8 md:rounded-3xl md:min-h-[430px] dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
            <p className="text-gray-500 text-center">Loading page...</p> {/* Slightly different text */}
            </div>
        </main>
    );
}

export default function Browse() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowseContent />
    </Suspense>
  );
}