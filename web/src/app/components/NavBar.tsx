import Link from "next/link";
import { Github } from "lucide-react";

export default async function Navbar() {
  return (
    <header className="m-4">
      <div className="flex h-14 items-center justify-between rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-gray-900 dark:text-white"
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>

        {/* Navigation Links */}
        <nav className="pl-8 flex flex-1 items-center space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link
            href="/browse"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Browse
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="https://github.com/cs461-text-adventure/code"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="/login">
            <button className="text-sm text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
