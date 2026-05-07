import Link from "next/link";
import { Tv2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavActions } from "./NavActions";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center glow-emerald transition-transform group-hover:scale-110">
            <Tv2 size={18} className="text-black" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-gradient">Ani</span>
            <span className="text-primary">Noren</span>
          </span>
        </Link>

        {/* Nav links — desktop uniquement */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/", label: "Accueil" },
            { href: "/posts", label: "Articles" },
            { href: "/search", label: "Recherche" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-secondary hover:text-primary text-sm transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <NavActions />
        </div>

        {/* Mobile : theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
