"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="m-4">
      <div className="flex h-14 items-center justify-between rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-gray-900 dark:text-white">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900 dark:text-white"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center md:pl-8 space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="https://github.com/cs461-text-adventure/code"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
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

      {/* Mobile Fullscreen Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col p-8 z-50">
          {/* Close Button */}
          <button
            className="absolute top-8 right-8 text-gray-900 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="font-bold text-gray-900 dark:text-white">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-6 font-semibold text-md text-gray-700 dark:text-gray-300 mt-16">
            <Link
              href="/browse"
              className="hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="https://github.com/cs461-text-adventure/code"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white" />
            </Link>
          </nav>

          {/* Action Buttons (Bottom) */}
          <div className="w-full space-x-2 border-t border-gray-300 dark:border-gray-700 p-4 fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-40 flex">
            <Link
              href="/login"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              <button className="w-full text-md text-gray-900 dark:text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
                Sign In
              </button>
            </Link>
            <Link
              href="/signup"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              <button className="w-full text-md text-white bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
