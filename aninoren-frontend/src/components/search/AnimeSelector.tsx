"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Search, Loader2, Star, Calendar, X, CheckCircle, Tv } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAnime } from "@/lib/api";
import { AnimeResult } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeSelectorProps {
  onSelect: (anime: AnimeResult | null) => void;
  selected: AnimeResult | null;
}

export function AnimeSelector({ onSelect, selected }: AnimeSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => { setMounted(true); }, []);

  // Calculer la position du dropdown en fonction de l'input
  function updateDropdownPosition() {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const dropdown = document.getElementById("anime-dropdown-portal");
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdown && !dropdown.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculer position si scroll ou resize
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => updateDropdownPosition();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    searchAnime(debouncedQuery)
      .then((r) => {
        setResults(r);
        if (r.length > 0) {
          updateDropdownPosition();
          setOpen(true);
        }
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  function handleSelect(anime: AnimeResult) {
    onSelect(anime);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function handleClear() {
    onSelect(null);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  // Le dropdown rendu via portal dans le body
  const dropdown = mounted && open && results.length > 0 ? createPortal(
    <div id="anime-dropdown-portal" style={dropdownStyle}>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="glass border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "320px", overflowY: "auto" }}
      >
        {results.map((anime, i) => (
          <button
            key={anime.mal_id}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSelect(anime); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors text-left",
              i < results.length - 1 && "border-b border-white/5"
            )}
          >
            {/* Poster */}
            <div className="relative w-9 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-900/30">
              {anime.image && (
                <Image src={anime.image} alt={anime.titre} fill className="object-cover" sizes="36px" />
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{anime.titre}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {anime.score && (
                  <span className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star size={10} fill="currentColor" />{anime.score}
                  </span>
                )}
                {anime.annee && (
                  <span className="text-white/30 text-xs">{anime.annee}</span>
                )}
                <span className="text-white/20 text-xs truncate hidden sm:block">
                  {anime.synopsis.substring(0, 55)}...
                </span>
              </div>
            </div>

            {selected?.mal_id === anime.mal_id && (
              <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
            )}
          </button>
        ))}
      </motion.div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">

      {/* ── Carte anime sélectionné ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative flex gap-4 rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 overflow-hidden"
          >
            {/* Fond flou */}
            {selected.image && (
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Image src={selected.image} alt="" fill className="object-cover blur-xl scale-110" sizes="100vw" />
              </div>
            )}

            {/* Poster */}
            <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              {selected.image
                ? <Image src={selected.image} alt={selected.titre} fill className="object-cover" sizes="80px" />
                : <div className="w-full h-full bg-emerald-900/40 flex items-center justify-center text-3xl">🎌</div>
              }
            </div>

            {/* Infos */}
            <div className="relative flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle size={13} className="text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">Anime sélectionné</span>
                  </div>
                  <h3 className="text-white font-bold text-base leading-tight">{selected.titre}</h3>
                </div>
                <button type="button" onClick={handleClear}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors flex-shrink-0">
                  <X size={13} className="text-white/60" />
                </button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {selected.score && (
                  <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                    <Star size={13} fill="currentColor" />{selected.score}
                  </span>
                )}
                {selected.annee && (
                  <span className="flex items-center gap-1 text-white/40 text-xs">
                    <Calendar size={12} />{selected.annee}
                  </span>
                )}
                <span className="flex items-center gap-1 text-white/40 text-xs">
                  <Tv size={12} />#{selected.mal_id}
                </span>
              </div>

              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{selected.synopsis}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input de recherche ── */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) { updateDropdownPosition(); setOpen(true); } }}
          placeholder={selected ? "Changer d'anime..." : "Rechercher un anime... (ex: Naruto, AoT)"}
          className={cn(
            "w-full bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-white/30",
            "focus:outline-none focus:ring-1 transition-all duration-200",
            selected
              ? "border-emerald-500/20 focus:border-emerald-500/40 focus:ring-emerald-500/10"
              : "border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading
            ? <Loader2 size={15} className="text-emerald-400 animate-spin" />
            : query
            ? <button type="button" onClick={() => { setQuery(""); setResults([]); setOpen(false); }}>
                <X size={15} className="text-white/30 hover:text-white transition-colors" />
              </button>
            : null
          }
        </div>
      </div>

      {/* Aucun résultat */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="text-white/30 text-xs text-center py-1">
          Aucun anime trouvé pour &quot;{query}&quot;
        </p>
      )}

      {/* Portal dropdown */}
      {dropdown}
    </div>
  );
}
