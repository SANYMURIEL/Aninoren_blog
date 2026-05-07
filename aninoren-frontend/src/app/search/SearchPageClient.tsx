"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Calendar, BookOpen } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAnime } from "@/lib/api";
import { AnimeResult } from "@/types";
import { AnimeSearchBar } from "@/components/search/AnimeSearchBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

export function SearchPageClient() {
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // On écoute la sélection depuis la barre de recherche
  // mais en mode standalone on affiche les résultats directement
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); return; }
    setLoading(true);
    searchAnime(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un anime... (ex: Naruto, One Piece)"
          className="w-full input-base rounded-xl pl-5 pr-5 py-4 text-lg placeholder:text-muted focus:outline-none transition-all"
        />
      </div>

      {/* Résultats */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((anime) => (
            <StaggerItem key={anime.mal_id}>
              <Card className="flex gap-4 p-4 h-full">
                {/* Poster */}
                <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  {anime.image ? (
                    <Image src={anime.image} alt={anime.titre} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center text-2xl">🎌</div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <h3 className="text-primary font-semibold text-sm leading-tight line-clamp-2">
                    {anime.titre}
                  </h3>

                  <div className="flex items-center gap-3 flex-wrap">
                    {anime.score && (
                      <span className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star size={11} fill="currentColor" />
                        {anime.score}
                      </span>
                    )}
                    {anime.annee && (
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar size={11} />
                        {anime.annee}
                      </span>
                    )}
                    <Badge variant="glass">#{anime.mal_id}</Badge>
                  </div>

                  <p className="text-white/40 text-xs leading-relaxed line-clamp-3 mt-1">
                    {anime.synopsis}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-16 text-muted">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun anime trouvé pour &quot;{query}&quot;</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-muted">
          <p className="text-5xl mb-4">🔍</p>
          <p>Tape au moins 2 caractères pour lancer la recherche</p>
        </div>
      )}
    </div>
  );
}
