"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MindMap from "../components/MindMap";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  useEffect(() => {
    if (!query) {
      router.push("/");
      return;
    }

    // Update search input when query changes
    setSearchInput(query);

    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   const response = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`);
    //   const data = await response.json();
    //   setGraphData(data);
    //   setLoading(false);
    // };
    // fetchData();

    // For now, use placeholder data
    const placeholderData = {
      nodes: [
        {
          link: "https://diamondpearl.pokemon.com/en-us/trainersguide/fundamentals/",
          title: "Pokémon Trainer Fundamentals",
          overview:
            "Official walkthrough of catching, raising, and battling Pokémon in the core games.",
          topic: "Fundamentals",
        },
        {
          link: "https://www.dragonflycave.com/mechanics",
          title: "Game Mechanics Deep Dive",
          overview:
            "In-depth explanations of stat calculations, battle modifiers, and capture algorithms.",
          topic: "Mechanics",
        },
        {
          link: "https://www.instructables.com/How-to-Build-a-Competitive-Pokemon-Team-a-Comprehe/",
          title: "Competitive Team Building Guide",
          overview:
            "Step-by-step guide for team-building in competitive formats, covering IVs, EVs, and tiers.",
          topic: "Competitive",
        },
        {
          link: "https://www.smogon.com/dp/articles/intro_comp_pokemon",
          title: "Introduction to Competitive Play",
          overview:
            "Overview of competitive Pokémon play emphasizing mechanics, team organization, and tactics.",
          topic: "Competitive",
        },
        {
          link: "https://www.vgcguide.com/",
          title: "VGC Strategy Guide",
          overview:
            "Comprehensive resource for building competitive teams and understanding meta-game tactics.",
          topic: "Competitive",
        },
        {
          link: "https://scarletviolet.pokemon.com/en-us/trainers-guide/the-terastal-phenomenon/",
          title: "Terastal Phenomenon Guide",
          overview:
            "Official explanation of the Tera-type mechanic and how it changes battle strategy.",
          topic: "Advanced Mechanics",
        },
        {
          link: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Showdown",
          title: "Pokémon Showdown Simulator",
          overview:
            "Browser-based simulator for competitive Pokémon that lets you build teams and test strategies.",
          topic: "Tools",
        },
        {
          link: "https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources",
          title: "Official Tournament Rules",
          overview:
            "Official tournament rules and resources for Pokémon video game competition.",
          topic: "Competitive",
        },
        {
          link: "https://www.pokemon.com/us/pokedex/",
          title: "Pokédex Database",
          overview:
            "Official database of every Pokémon species, forms, moves and abilities.",
          topic: "Fundamentals",
        },
        {
          link: "https://bulbapedia.bulbagarden.net/wiki/Move_(Pok%C3%A9mon)",
          title: "Moves and Abilities Guide",
          overview:
            "Deep guide to Pokémon moves, abilities, categories, effects, and mechanics.",
          topic: "Mechanics",
        },
        {
          link: "https://bulbapedia.bulbagarden.net/wiki/Type",
          title: "Type Effectiveness Chart",
          overview:
            "Comprehensive chart of Pokémon types and their effectiveness relationships.",
          topic: "Mechanics",
        },
        {
          link: "https://bulbapedia.bulbagarden.net/wiki/Breeding",
          title: "Breeding Mechanics",
          overview:
            "Deep dive into breeding, egg groups, inheritance of IVs/abilities and chain breeding.",
          topic: "Mechanics",
        },
        {
          link: "https://bulbapedia.bulbagarden.net/wiki/Nature",
          title: "Natures and Stats",
          overview:
            "Guide to hidden values (IVs), effort values (EVs), and natures in competitive play.",
          topic: "Mechanics",
        },
        {
          link: "https://www.smogon.com/dp/articles/teambuilding101",
          title: "Team Building 101",
          overview:
            "Introduction to building functional competitive teams with synergy and role coverage.",
          topic: "Competitive",
        },
        {
          link: "https://www.smogon.com/dp/articles/metagame/",
          title: "Metagame and Tiering",
          overview:
            "Guide to how tiers, bans, formats and metagame evolution shape competitive play.",
          topic: "Competitive",
        },
        {
          link: "https://www.pokemon.com/us/pokemon-tcg",
          title: "Pokémon Trading Card Game",
          overview:
            "Official tutorial covering the basics of the Pokémon Trading Card Game rules.",
          topic: "Alternate Format",
        },
        {
          link: "https://www.pokemon.com/us/pokemon-go",
          title: "Pokémon GO",
          overview:
            "Introduction to AR-based Pokémon gameplay and mobile gaming experience.",
          topic: "Alternate Format",
        },
        {
          link: "https://bulbapedia.bulbagarden.net/wiki/Evolution",
          title: "Evolution Methods",
          overview:
            "Detailed explanation of how Pokémon evolve through levels, items, friendship, and trading.",
          topic: "Fundamentals",
        },
      ],
      edges: [
        { source: "Pokémon Trainer Fundamentals", target: "Pokédex Database" },
        { source: "Pokémon Trainer Fundamentals", target: "Evolution Methods" },
        { source: "Pokédex Database", target: "Moves and Abilities Guide" },
        { source: "Pokédex Database", target: "Type Effectiveness Chart" },
        { source: "Moves and Abilities Guide", target: "Game Mechanics Deep Dive" },
        { source: "Type Effectiveness Chart", target: "Game Mechanics Deep Dive" },
        { source: "Game Mechanics Deep Dive", target: "Natures and Stats" },
        { source: "Game Mechanics Deep Dive", target: "Terastal Phenomenon Guide" },
        { source: "Natures and Stats", target: "Breeding Mechanics" },
        { source: "Breeding Mechanics", target: "Competitive Team Building Guide" },
        { source: "Natures and Stats", target: "Competitive Team Building Guide" },
        { source: "Competitive Team Building Guide", target: "Introduction to Competitive Play" },
        { source: "Competitive Team Building Guide", target: "Team Building 101" },
        { source: "Introduction to Competitive Play", target: "Team Building 101" },
        { source: "Team Building 101", target: "Metagame and Tiering" },
        { source: "Metagame and Tiering", target: "VGC Strategy Guide" },
        { source: "Introduction to Competitive Play", target: "VGC Strategy Guide" },
        { source: "Pokémon Showdown Simulator", target: "Introduction to Competitive Play" },
        { source: "Pokémon Showdown Simulator", target: "Team Building 101" },
        { source: "Terastal Phenomenon Guide", target: "VGC Strategy Guide" },
        { source: "Official Tournament Rules", target: "VGC Strategy Guide" },
        { source: "Official Tournament Rules", target: "Metagame and Tiering" },
        { source: "Type Effectiveness Chart", target: "Competitive Team Building Guide" },
        { source: "Evolution Methods", target: "Breeding Mechanics" },
        { source: "Pokémon Trainer Fundamentals", target: "Pokémon GO" },
        { source: "Pokédex Database", target: "Pokémon Trading Card Game" },
      ],
    };

    setGraphData(placeholderData);
    setLoading(false);
  }, [query, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-zinc-950 dark:to-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Generating mind map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating search bar */}
      <div className="absolute left-1/2 top-6 z-10 w-full max-w-2xl -translate-x-1/2 px-6">
        <form onSubmit={handleSearch}>
          <div className="group relative">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
            
            <div className="relative rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any topic..."
                className="w-full rounded-full border-0 bg-transparent px-6 py-3.5 text-base text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-2 text-sm font-light text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <MindMap data={graphData} />
    </div>
  );
}
