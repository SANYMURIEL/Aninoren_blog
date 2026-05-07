"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenSquare, Search, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isLoggedIn, removeToken } from "@/lib/auth";
import { AnimatePresence, motion } from "framer-motion";

export function NavActions() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/search">
        <Button variant="ghost" size="sm" aria-label="Recherche">
          <Search size={16} />
        </Button>
      </Link>

      {loggedIn ? (
        // ── Menu admin ──────────────────────────────────────────────────────
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 glass border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-400 text-sm font-medium hover:border-emerald-500/60 transition-all"
          >
            <Shield size={14} />
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                <Link
                  href="/admin/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm border-b border-white/5"
                >
                  <PenSquare size={15} className="text-emerald-400" />
                  Nouvel article
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm"
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // ── Bouton Écrire (non connecté) ────────────────────────────────────
        <Link href="/admin/create">
          <Button variant="primary" size="sm">
            <PenSquare size={14} />
            <span className="hidden sm:inline">Écrire</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
