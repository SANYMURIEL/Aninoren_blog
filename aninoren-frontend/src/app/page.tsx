import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { BentoGrid } from "@/components/home/BentoGrid";
import { SeasonWidget } from "@/components/home/SeasonWidget";
import { getPosts } from "@/lib/api";
import { Post } from "@/types";

export default async function HomePage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        <HeroSection />

        {/* Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">
              Derniers articles <span className="text-emerald-400">✦</span>
            </h2>
            <span className="text-muted text-sm">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>
          <BentoGrid posts={posts} />
        </section>

        {/* Animes de la saison — Server Component avec fetch Jikan */}
        <SeasonWidget />

      </main>

      <footer className="border-t border-black/5 dark:border-white/5 py-8 text-center text-muted text-sm">
        <p>AniNoren © {new Date().getFullYear()} — Fait avec ❤️ et beaucoup d&apos;anime</p>
      </footer>
    </div>
  );
}
