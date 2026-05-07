import { Navbar } from "@/components/layout/Navbar";
import { SearchPageClient } from "./SearchPageClient";

export const metadata = {
  title: "Recherche Anime — AniNoren",
  description: "Recherche un anime dans la base MyAnimeList",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-primary mb-2">
            Recherche <span className="text-gradient">Anime</span>
          </h1>
          <p className="text-muted">Explore la base MyAnimeList via Jikan API</p>
        </div>
        <SearchPageClient />
      </main>
    </div>
  );
}
