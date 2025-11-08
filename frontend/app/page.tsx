"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Navigate to search page with query parameter
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (showGraph) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-zinc-950 dark:to-black">
        <div className="border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              onClick={() => setShowGraph(false)}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              ← Back
            </button>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              {query}
            </h2>
            <div className="w-16" />
          </div>
        </div>
        <MindMap data={graphData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-zinc-950 dark:to-black">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl text-center"
        >
          {/* MindMap Title */}
          <h1 className="mb-3 text-7xl font-light tracking-tight bg-gradient-to-b from-black to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400 md:text-8xl">
            MindMap
          </h1>

          {/* Tagline */}
          <p className="mb-16 text-xl text-zinc-600 dark:text-zinc-400 font-light">
            AI-powered knowledge visualization
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="group relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any topic..."
                  className="w-full rounded-[2rem] border-0 bg-white px-8 py-6 text-xl shadow-2xl shadow-black/5 ring-1 ring-black/5 transition-all duration-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-500/10 dark:bg-zinc-900 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-600 dark:focus:ring-blue-400/50"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 dark:from-blue-600 dark:to-blue-700"
                >
                  Explore
                </button>
              </div>
            </div>
          </form>

          {/* Suggestion Chips */}
          <div className="flex justify-center gap-3 text-sm text-zinc-500 dark:text-zinc-600">
            <button
              onClick={() => setQuery("Pokémon")}
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all"
            >
              Try: "Pokémon"
            </button>
            <button
              onClick={() => setQuery("Machine Learning")}
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all"
            >
              "Machine Learning"
            </button>
            <button
              onClick={() => setQuery("Quantum Physics")}
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all"
            >
              "Quantum Physics"
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-600">Scroll to learn more</span>
          <svg className="w-5 h-5 animate-bounce text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Example Demo Section */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="mb-16 text-center text-5xl font-light text-black dark:text-white">
            See it in action
          </h2>

          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Demo Preview */}
            <div className="relative h-[400px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <div className="relative h-full p-8">
                <MindMap data={placeholderData} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-3xl font-light text-black dark:text-white">
                Interactive knowledge graphs
              </h3>
              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Watch as AI transforms any topic into a beautiful, interactive visualization. Explore connections, discover relationships, and understand complex subjects through visual learning.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">Dynamic node expansion</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">Zoom and pan controls</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">Curated learning resources</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="mb-4 text-center text-5xl font-light text-black dark:text-white">
            How it works
          </h2>
          <p className="mb-16 text-center text-xl text-zinc-600 dark:text-zinc-400">
            Three simple steps to visual learning
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-medium text-black dark:text-white">Enter a topic</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Type any subject you want to explore and understand</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 dark:bg-purple-500/20">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-medium text-black dark:text-white">AI generates connections</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Watch as relationships are mapped visually in real-time</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-8"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 dark:bg-pink-500/20">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-medium text-black dark:text-white">Explore visually</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Interact with nodes, zoom, and discover new insights</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-12 text-5xl font-light text-black dark:text-white">
            Ready to explore?
          </h2>

          <form onSubmit={handleSearch} className="relative">
            <div className="group relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-2xl opacity-60" />

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any topic..."
                  className="w-full rounded-[2rem] border-0 bg-white px-8 py-5 text-lg shadow-xl shadow-black/5 ring-1 ring-black/5 transition-all duration-300 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-zinc-900 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
                >
                  Explore
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-4">
        <div className="mx-auto max-w-6xl text-center text-sm text-zinc-500 dark:text-zinc-600">
          <p>© 2025 MindMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
