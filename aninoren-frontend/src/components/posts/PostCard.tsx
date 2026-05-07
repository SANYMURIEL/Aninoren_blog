import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Post } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  featured?: boolean;
  className?: string;
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
  const date = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const preview = post.contenu.length > 120
    ? post.contenu.substring(0, 120) + "..."
    : post.contenu;

  return (
    <Link href={`/posts/${post._id}`} className="block h-full">
      <Card className={cn("h-full flex flex-col group cursor-pointer", className)}>
        {/* Image */}
        <div className={cn("relative overflow-hidden", featured ? "h-64" : "h-40")}>
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "33vw"}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900/40 to-amber-900/20 flex items-center justify-center">
              <span className="text-4xl">🎌</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge variant="emerald">{post.anime_titre}</Badge>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3 className={cn(
            "font-bold text-primary leading-tight group-hover:text-emerald-500 transition-colors",
            featured ? "text-xl" : "text-base"
          )}>
            {post.titre}
          </h3>

          {featured && (
            <p className="text-secondary text-sm leading-relaxed">{preview}</p>
          )}

          <div className="flex items-center gap-3 mt-auto pt-2 border-t border-black/5 dark:border-white/5">
            <span className="flex items-center gap-1 text-muted text-xs">
              <Calendar size={12} />
              {date}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
