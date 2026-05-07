import { Post } from "@/types";
import { PostCard } from "@/components/posts/PostCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

interface BentoGridProps {
  posts: Post[];
}

export function BentoGrid({ posts }: BentoGridProps) {
  if (posts.length === 0) {
    return (
      <FadeUp>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="text-6xl">🎌</span>
          <p className="text-white/40 text-lg">Aucun article pour le moment</p>
          <Link href="/admin/create" className="text-emerald-400 hover:text-emerald-300 text-sm underline underline-offset-4">
            Créer le premier article
          </Link>
        </div>
      </FadeUp>
    );
  }

  const [featured, ...rest] = posts;
  const secondaries = rest.slice(0, 2);
  const smalls = rest.slice(2, 5);

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {/* Grande carte featured */}
      {featured && (
        <StaggerItem className="md:col-span-2 lg:col-span-2 row-span-2">
          <PostCard post={featured} featured className="h-full min-h-[420px]" />
        </StaggerItem>
      )}

      {/* Cartes secondaires */}
      {secondaries.map((post) => (
        <StaggerItem key={post._id} className="col-span-1">
          <PostCard post={post} className="h-full min-h-[200px]" />
        </StaggerItem>
      ))}

      {/* Widget stats */}
      <StaggerItem className="col-span-1">
        <Card className="p-5 flex flex-col gap-3 min-h-[200px] h-full">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-amber-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Stats</span>
          </div>
          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Articles</span>
              <span className="text-emerald-400 font-bold text-2xl">{posts.length}</span>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Animes couverts</span>
              <span className="text-amber-400 font-bold text-2xl">
                {new Set(posts.map((p) => p.id_anime_jikan)).size}
              </span>
            </div>
          </div>
        </Card>
      </StaggerItem>

      {/* Petites cartes */}
      {smalls.map((post) => (
        <StaggerItem key={post._id} className="col-span-1">
          <PostCard post={post} className="h-full min-h-[180px]" />
        </StaggerItem>
      ))}

      {/* Widget à propos */}
      <StaggerItem className="col-span-1">
        <Card className="p-5 flex flex-col gap-3 bg-gradient-to-br from-emerald-900/20 to-amber-900/10 min-h-[180px] h-full">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">À propos</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Un blog passionné dédié à l&apos;univers des animes. Analyses, avis et découvertes.
          </p>
          <div className="flex flex-wrap gap-1 mt-auto">
            <Badge variant="emerald">Shonen</Badge>
            <Badge variant="saffron">Seinen</Badge>
            <Badge variant="glass">Isekai</Badge>
          </div>
        </Card>
      </StaggerItem>

    </StaggerContainer>
  );
}
