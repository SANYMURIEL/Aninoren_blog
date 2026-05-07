import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6">
        {/* Tag */}
        <div className="flex items-center gap-2 card-base px-4 py-1.5 rounded-full text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} />
          <span>Blog Anime & Manga</span>
        </div>

        {/* Titre */}
        <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight">
          <span className="text-primary">Bienvenue sur </span>
          <span className="text-gradient">AniNoren</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-secondary text-lg max-w-xl leading-relaxed">
          Analyses, avis et coups de cœur sur l&apos;univers des animes.
          Plonge dans la culture otaku avec passion.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/posts">
            <Button variant="primary" size="lg">Lire les articles</Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" size="lg">Chercher un anime</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
