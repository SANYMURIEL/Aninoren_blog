import Link from "next/link";
import { Tv2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavActions } from "./NavActions";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center glow-emerald transition-transform group-hover:scale-110">
            <Tv2 size={18} className="text-black" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-gradient">Ani</span>
            <span className="text-white">Noren</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/", label: "Accueil" },
            { href: "/posts", label: "Articles" },
            { href: "/search", label: "Recherche" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white/60 hover:text-white text-sm transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Actions côté client (login state) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavActions />
        </div>
      </div>
    </header>
  );
}
