"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-zinc-950 dark:to-black">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSearch} className="relative">
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

          <div className="mt-8 flex justify-center gap-3 text-sm text-zinc-500 dark:text-zinc-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              Try: "Pokémon"
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              "Machine Learning"
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              "Quantum Physics"
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
