"use client";

// TODO: refactor -  make contant via components
// TODO: share section edit this section to adjust real experience
// TODO: edit appropriate icons to the content

import Navbar from "@/components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [demoText, setDemoText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const demoCommands = [
      "T: You are standing against strange door with old eye symbol on it.",
      "> walk into room",
      "T: you are standing in the middle of the old dusty classroom ",
      "> look around",
      "T: You are in a dimly lit classroom. Ancient artifact laying in the middle of strange postament",
      "> examine artifact",
      "T: You take a closer look on artifact. It is small golden statue of goddess Sekhmet...",
    ];

    if (currentIndex >= demoCommands.length) {
      const resetTimer = setTimeout(() => {
        setDemoText("");
        setCurrentIndex(0);
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimer);
    }

    if (charIndex < demoCommands[currentIndex].length) {
      const typingTimer = setTimeout(() => {
        setDemoText((prev) => prev + demoCommands[currentIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, 50); // Adjust typing speed here (lower = faster)
      return () => clearTimeout(typingTimer);
    }

    if (charIndex === demoCommands[currentIndex].length) {
      const lineBreakTimer = setTimeout(() => {
        setDemoText((prev) => prev + "\n");
        setCurrentIndex(currentIndex + 1);
        setCharIndex(0);
      }, 1000); // Pause between lines
      return () => clearTimeout(lineBreakTimer);
    }
  }, [currentIndex, charIndex]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="space-y-2 mb-8">
            <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-full text-sm font-medium">
              Text Adventure Platform
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Turn Your Stories into
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                {" "}
                Interactive Adventures
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create, share, and explore educational text adventures. Engage
            students through interactive storytelling and make learning fun.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/browse" className="flex-none group">
              <button className="w-full sm:w-auto px-8 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all hover:shadow-xl hover:shadow-blue-600/20">
                Browse Games
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Link>
            <Link href="/signup" className="flex-none">
              <button className="w-full sm:w-auto px-8 py-4 text-white bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-white/10">
                Create Your Game
              </button>
            </Link>
          </div>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-7xl">
              {/* Interactive Learning */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Interactive Learning Through Story
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Immerse yourself in educational adventures where every
                    choice matters. Learn history, science, and more through
                    engaging narratives. Make your own stunning text adventures
                    and ingite others
                  </p>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <ul className="space-y-4">
                      {[
                        "Learning by creating",
                        "Educational content",
                        "Interactive choices",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* animation of playing in console*/}
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-gray-900 p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap text-left">
                      {demoText.split("\n").map((line, index) => (
                        <span
                          key={index}
                          className={
                            index % 2 === 0
                              ? "text-green-400"
                              : "text-green-800 block"
                          }
                        >
                          {line}
                          {index === demoText.split("\n").length - 1 && (
                            <span className="animate-pulse">_</span>
                          )}
                        </span>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Create Your Own */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="order-2 md:order-1">
                  <Image
                    src="/round-icons-PTHONxhEo2M-unsplash.png"
                    alt="Game Creator Interface"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-2xl"
                  />
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Easy Game Creation
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Create your own educational adventures with our intuitive
                    tools. No coding required - just your imagination and
                    knowledge to share.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                        Visual Editor
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Design your game flow visually
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                        Templates
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start with pre-made scenarios
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testing Features */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="order-1 md:order-2">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Test As You Build
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Quick Preview
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Test your game instantly
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Story Flow Check
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Verify all paths work
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-2 md:order-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Test Your Adventure
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Ensure your educational game flows smoothly with our
                    built-in testing tools. Preview and verify your story paths
                    before sharing with students.
                  </p>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <ul className="space-y-4">
                      {[
                        "Instant preview mode",
                        "Path verification",
                        "Error detection",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Share & Collaborate Section */}

              {/*TODO edit this section to adjust real experience*/}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          Easy Sharing{" "}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Track student engagement
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Quick share Link
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Temporary QR-code
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Share & Inspire Others
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Join a community of educators and storytellers. Share your
                    educational adventures and inspire others to create their
                    own learning experiences.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                        Easy Sharing
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Share with one click to your students
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                        Collaboration
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Work together with other educators
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Section */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                  Join Our Growing Community
                </h2>
              </div>
            </div>

            <div className="mt-16 flex justify-center gap-8 text-gray-400">
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm">Active Games</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Educational Topics</div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </section>
    </main>
  );
}
