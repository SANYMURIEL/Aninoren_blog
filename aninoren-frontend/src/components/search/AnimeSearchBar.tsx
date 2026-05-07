"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, Star, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAnime } from "@/lib/api";
import { AnimeResult } from "@/types";
import { cn } from "@/lib/utils";

interface AnimeSearchBarProps {
  onSelect?: (anime: AnimeResult) => void; // Pour le formulaire de création
  standalone?: boolean;                    // Mode page dédiée
}

export function AnimeSearchBar({ onSelect, standalone = false }: AnimeSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AnimeResult | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchAnime(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  function handleSelect(anime: AnimeResult) {
    setSelected(anime);
    setQuery(anime.titre);
    setResults([]);
    onSelect?.(anime);
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Rechercher un anime... (ex: Attack on Titan)"
          className={cn(
            "w-full glass border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-white/30",
            "focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20",
            "transition-all duration-200",
            standalone && "text-lg py-4"
          )}
        />
        {/* Loader / Clear */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 size={16} className="text-emerald-400 animate-spin" />
          ) : query ? (
            <button onClick={handleClear}>
              <X size={16} className="text-white/30 hover:text-white transition-colors" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown résultats */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
          {results.map((anime) => (
            <button
              key={anime.mal_id}
              onClick={() => handleSelect(anime)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
            >
              {/* Image */}
              <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                {anime.image ? (
                  <Image src={anime.image} alt={anime.titre} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center text-lg">🎌</div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{anime.titre}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {anime.score && (
                    <span className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={10} fill="currentColor" />
                      {anime.score}
                    </span>
                  )}
                  {anime.annee && (
                    <span className="text-white/30 text-xs">{anime.annee}</span>
                  )}
                </div>
                {standalone && (
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{anime.synopsis}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Résultat sélectionné (mode formulaire) */}
      {selected && !standalone && (
        <div className="mt-2 flex items-center gap-2 glass border border-emerald-500/30 rounded-xl p-3">
          {selected.image && (
            <div className="relative w-8 h-11 rounded overflow-hidden flex-shrink-0">
              <Image src={selected.image} alt={selected.titre} fill className="object-cover" sizes="32px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-emerald-400 text-sm font-medium truncate">✓ {selected.titre}</p>
            {selected.score && (
              <p className="text-white/40 text-xs flex items-center gap-1">
                <Star size={10} fill="currentColor" className="text-amber-400" />
                {selected.score}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
