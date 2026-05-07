import { Navbar } from "@/components/layout/Navbar";
import { CreatePostForm } from "./CreatePostForm";

export const metadata = {
  title: "Créer un article — AniNoren",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Nouvel <span className="text-gradient">article</span>
          </h1>
          <p className="text-white/40">Partage ton avis sur un anime</p>
        </div>
        <CreatePostForm />
      </main>
    </div>
  );
}
