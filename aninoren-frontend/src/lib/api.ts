import { Post, AnimeResult } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Erreur lors du chargement des posts");
  return res.json();
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${API_URL}/posts/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Post introuvable");
  return res.json();
}

export async function createPost(
  data: { titre: string; contenu: string; id_anime_jikan: number; anime_titre: string; image_url?: string },
  token: string
): Promise<Post> {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur lors de la création");
  }
  return res.json();
}

export async function deletePost(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, token: string): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Erreur lors de l'upload");
  return res.json();
}

// ─── Anime search ─────────────────────────────────────────────────────────────

export async function searchAnime(query: string): Promise<AnimeResult[]> {
  if (query.length < 2) return [];
  const res = await fetch(`${API_URL}/anime/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getAnimeById(id: number): Promise<AnimeResult | null> {
  const res = await fetch(`${API_URL}/anime/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

// ─── Anime saison (Jikan direct — pas de clé requise) ────────────────────────
// On appelle Jikan directement depuis le serveur Next.js pour les données de saison

export interface SeasonAnime {
  mal_id: number;
  titre: string;
  image: string;
  score: number | null;
  synopsis: string;
  genres: string[];
  episodes: number | null;
}

export async function getCurrentSeasonAnime(): Promise<SeasonAnime[]> {
  try {
    const res = await fetch("https://api.jikan.moe/v4/seasons/now?limit=6", {
      next: { revalidate: 3600 }, // Revalide toutes les heures
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data.slice(0, 6).map((a: any): SeasonAnime => ({
      mal_id: a.mal_id,
      titre: a.title,
      image: a.images?.jpg?.image_url ?? "",
      score: a.score ?? null,
      synopsis: a.synopsis ? a.synopsis.substring(0, 200) + "..." : "Aucun synopsis",
      genres: a.genres?.map((g: any) => g.name).slice(0, 3) ?? [],
      episodes: a.episodes ?? null,
    }));
  } catch {
    return [];
  }
}
