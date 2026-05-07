"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Home, BookOpen, Search, Shield, PenSquare, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { isLoggedIn, removeToken } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/posts", label: "Articles", icon: BookOpen },
  { href: "/search", label: "Recherche", icon: Search },
];

export function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // Fermer le menu quand la route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay + drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Fond sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 z-50 navbar-glass border-l border-black/5 dark:border-white/5 flex flex-col"
            >
              {/* Liens de navigation */}
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                      ${pathname === href
                        ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                        : "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Séparateur */}
              <div className="mx-4 h-px bg-black/5 dark:bg-white/5" />

              {/* Section admin */}
              <div className="flex flex-col p-4 gap-1">
                <p className="text-muted text-xs uppercase tracking-wider px-4 mb-1">Admin</p>

                {loggedIn ? (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Shield size={17} className="text-emerald-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/create"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <PenSquare size={17} className="text-emerald-400" />
                      Nouvel article
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-left"
                    >
                      <LogOut size={17} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Shield size={17} />
                    Connexion admin
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
