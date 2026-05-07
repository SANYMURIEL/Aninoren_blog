import Image from "next/image";
import { Star, Tv } from "lucide-react";
import { getCurrentSeasonAnime, SeasonAnime } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/MotionWrapper";

// Server Component — fetch direct Jikan côté serveur
export async function SeasonWidget() {
  let animes: SeasonAnime[] = [];
  try {
    animes = await getCurrentSeasonAnime();
  } catch {
    return null;
  }

  if (animes.length === 0) return null;

  return (
    <FadeUp>
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Saison en cours
            <span className="ml-2 text-amber-400">✦</span>
          </h2>
          <Badge variant="saffron">
            <Tv size={11} />
            En diffusion
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {animes.map((anime) => (
            <a
              key={anime.mal_id}
              href={`https://myanimelist.net/anime/${anime.mal_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="overflow-hidden h-full" hover>
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  {anime.image ? (
                    <Image
                      src={anime.image}
                      alt={anime.titre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center text-3xl">🎌</div>
                  )}
                  {/* Score overlay */}
                  {anime.score && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
                      <Star size={10} fill="#f59e0b" className="text-amber-400" />
                      <span className="text-white text-xs font-bold">{anime.score}</span>
                    </div>
                  )}
                  {/* Gradient bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Titre + genres */}
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {anime.titre}
                  </p>
                  {anime.genres.length > 0 && (
                    <p className="text-white/30 text-xs mt-1 truncate">
                      {anime.genres.join(" · ")}
                    </p>
                  )}
                  {anime.episodes && (
                    <p className="text-white/20 text-xs mt-0.5">
                      {anime.episodes} éps
                    </p>
                  )}
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </FadeUp>
  );
}
