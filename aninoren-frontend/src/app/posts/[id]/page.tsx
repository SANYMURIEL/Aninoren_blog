import { Navbar } from "@/components/layout/Navbar";
import { getPost, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/MotionWrapper";

// Génère les pages statiques pour les posts existants
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ id: p._id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await getPost(id);
    return { title: `${post.titre} — AniNoren`, description: post.contenu.substring(0, 160) };
  } catch {
    return { title: "Article — AniNoren" };
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post;
  try {
    post = await getPost(id);
  } catch {
    notFound();
  }

  const date = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour
        </Link>

        <FadeUp>
          {/* Image de couverture */}
          {post.image_url && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
              <Image src={post.image_url} alt={post.titre} fill className="object-cover" sizes="100vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="emerald">{post.anime_titre}</Badge>
            <span className="flex items-center gap-1 text-white/30 text-xs">
              <Calendar size={12} /> {date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-8">
            {post.titre}
          </h1>

          {/* Contenu */}
          <div className="prose prose-invert max-w-none">
            {post.contenu.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-white/70 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ) : <br key={i} />
            )}
          </div>
        </FadeUp>
      </main>
    </div>
  );
}
