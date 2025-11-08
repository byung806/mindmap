"use client";

import { useState } from "react";
import MindMap from "./components/MindMap";

export default function Home() {
  const [query, setQuery] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // TODO: Replace with actual API call
    // const response = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`);
    // const data = await response.json();
    
    // For now, use placeholder data
    const placeholderData = {
      nodes: [
        { link: "https://diamondpearl.pokemon.com/en-us/trainersguide/fundamentals/", title: "Pokémon Trainer Fundamentals (Official Guide)", overview: "Official walkthrough of catching, raising, and battling Pokémon in the core games.", topic: "Fundamentals" },
        { link: "https://www.dragonflycave.com/mechanics", title: "Game Mechanics — Pokémon Deep Dive", overview: "In-depth explanations of stat calculations, battle modifiers, and capture algorithms across generations.", topic: "Mechanics" },
        { link: "https://www.instructables.com/How-to-Build-a-Competitive-Pokemon-Team-a-Comprehe/", title: "How to Build a Competitive Pokémon Team: A Comprehensive Guide", overview: "Step-by-step guide for team-building in competitive formats, covering IVs, EVs, tiers and simulators.", topic: "Competitive" },
        { link: "https://www.smogon.com/dp/articles/intro_comp_pokemon", title: "Introduction to Competitive Pokémon (Smogon)", overview: "Overview of competitive Pokémon play emphasizing mechanics, team organization, and battle tactics.", topic: "Competitive" },
        { link: "https://www.vgcguide.com/", title: "VGC Guide – Competitive Pokémon Strategy", overview: "Comprehensive resource for building competitive teams and understanding meta-game tactics.", topic: "Competitive" },
        { link: "https://scarletviolet.pokemon.com/en-us/trainers-guide/the-terastal-phenomenon/", title: "The Terastal Phenomenon – Pokémon Scarlet & Violet", overview: "Official explanation of the Tera-type mechanic and how it changes battle strategy in Scarlet & Violet.", topic: "Advanced Mechanics" },
        { link: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Showdown", title: "Pokémon Showdown – Battle Simulator", overview: "Browser-based simulator for competitive Pokémon that lets you build teams and test strategies.", topic: "Tools" },
        { link: "https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources", title: "Play! Pokémon Rules & Resources", overview: "Official tournament rules and resources for Pokémon video game competition.", topic: "Competitive" },
        { link: "https://www.pokemon.com/us/pokedex/", title: "Pokédex – Official Pokémon Database", overview: "Official database of every Pokémon species, forms, moves and abilities—essential reference.", topic: "Fundamentals" },
        { link: "https://bulbapedia.bulbagarden.net/wiki/Move_(Pok%C3%A9mon)", title: "Moves and Abilities – Bulbapedia Guide", overview: "Deep guide to Pokémon moves, abilities, categories, effects, and mechanics across generations.", topic: "Mechanics" }
      ],
      edges: [
        { source: "Pokémon Trainer Fundamentals (Official Guide)", target: "Pokédex – Official Pokémon Database" },
        { source: "Pokémon Trainer Fundamentals (Official Guide)", target: "Moves and Abilities – Bulbapedia Guide" },
        { source: "Pokédex – Official Pokémon Database", target: "Moves and Abilities – Bulbapedia Guide" },
        { source: "Moves and Abilities – Bulbapedia Guide", target: "Game Mechanics — Pokémon Deep Dive" },
        { source: "Game Mechanics — Pokémon Deep Dive", target: "The Terastal Phenomenon – Pokémon Scarlet & Violet" },
        { source: "How to Build a Competitive Pokémon Team: A Comprehensive Guide", target: "Introduction to Competitive Pokémon (Smogon)" },
        { source: "Introduction to Competitive Pokémon (Smogon)", target: "VGC Guide – Competitive Pokémon Strategy" },
        { source: "Pokémon Showdown – Battle Simulator", target: "Introduction to Competitive Pokémon (Smogon)" },
        { source: "The Terastal Phenomenon – Pokémon Scarlet & Violet", target: "VGC Guide – Competitive Pokémon Strategy" }
      ]
    };

    setGraphData(placeholderData);
    setShowGraph(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-zinc-950 dark:to-black">
      {!showGraph ? (
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
      ) : (
        <div className="min-h-screen">
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
      )}
    </div>
  );
}
