export interface Post {
  _id: string;
  titre: string;
  contenu: string;
  id_anime_jikan: number;
  anime_titre: string;
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnimeResult {
  mal_id: number;
  titre: string;
  image: string;
  synopsis: string;
  score: number | null;
  annee: number | null;
}
