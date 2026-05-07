import { Navbar } from "@/components/layout/Navbar";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/posts/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

import { Post } from "@/types";

export const metadata = {
  title: "Tous les articles — AniNoren",
};

export default async function PostsPage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Tous les <span className="text-gradient">articles</span>
          </h1>
          <p className="text-white/40">{posts.length} article{posts.length > 1 ? "s" : ""} publiés</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <p className="text-5xl mb-4">📭</p>
            <p>Aucun article pour le moment</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <StaggerItem key={post._id}>
                <PostCard post={post} className="h-full" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
    </div>
  );
}
