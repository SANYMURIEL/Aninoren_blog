"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LogIn, LogOut, Shield, PenSquare, Trash2, Edit3,
  Loader2, AlertCircle, CheckCircle, Plus, Eye,
  BarChart2, FileText, Tv, RefreshCw, X, Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/MotionWrapper";
import { AnimeSelector } from "@/components/search/AnimeSelector";
import { ImageDropzone } from "@/components/create/ImageDropzone";
import { getPosts, deletePost, updatePost, createPost } from "@/lib/api";
import { getToken, setToken, isLoggedIn, login, removeToken } from "@/lib/auth";
import { Post, AnimeResult } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "dashboard" | "create" | "edit";

// ─── Composant principal ──────────────────────────────────────────────────────
export function AdminDashboard() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // Charger les posts
  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      showToast("error", "Impossible de charger les articles");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadPosts();
  }, [loggedIn, loadPosts]);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const token = await login(loginEmail, loginPassword);
      setToken(token);
      setLoggedIn(true);
    } catch {
      setLoginError("Email ou mot de passe incorrect");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    router.push("/");
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Supprimer "${post.titre}" ?`)) return;
    const token = getToken();
    if (!token) return;
    try {
      await deletePost(post._id, token);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      showToast("success", "Article supprimé");
      router.refresh();
    } catch {
      showToast("error", "Erreur lors de la suppression");
    }
  }

  function handleEdit(post: Post) {
    setEditingPost(post);
    setView("edit");
  }

  function handleCreated(post: Post) {
    setPosts((prev) => [post, ...prev]);
    setView("dashboard");
    showToast("success", "Article publié !");
    router.refresh();
  }

  function handleUpdated(post: Post) {
    setPosts((prev) => prev.map((p) => (p._id === post._id ? post : p)));
    setView("dashboard");
    setEditingPost(null);
    showToast("success", "Article mis à jour !");
    router.refresh();
  }

  // ── Écran login ─────────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <FadeUp>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-primary mb-1">Espace Admin</h1>
            <p className="text-secondary text-sm">Connexion requise</p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-secondary text-sm mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@aninoren.com"
                  required
                  className="input-base w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-secondary text-sm mb-1.5 block">Mot de passe</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-base w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                />
              </div>
              {loginError && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> {loginError}
                </p>
              )}
              <Button type="submit" variant="primary" disabled={loginLoading} className="w-full mt-2">
                {loginLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                Se connecter
              </Button>
            </form>
          </Card>
        </div>
      </FadeUp>
    );
  }

  // ── Vue création ─────────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <FadeUp>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView("dashboard")}
            className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-black text-primary">
            Nouvel <span className="text-gradient">article</span>
          </h1>
        </div>
        <PostForm
          onSuccess={handleCreated}
          onCancel={() => setView("dashboard")}
        />
      </FadeUp>
    );
  }

  // ── Vue édition ──────────────────────────────────────────────────────────────
  if (view === "edit" && editingPost) {
    return (
      <FadeUp>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setView("dashboard"); setEditingPost(null); }}
            className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-black text-primary">
            Modifier <span className="text-gradient">l&apos;article</span>
          </h1>
        </div>
        <PostForm
          post={editingPost}
          onSuccess={handleUpdated}
          onCancel={() => { setView("dashboard"); setEditingPost(null); }}
        />
      </FadeUp>
    );
  }

  // ── Dashboard principal ──────────────────────────────────────────────────────
  const uniqueAnimes = new Set(posts.map((p) => p.id_anime_jikan)).size;

  return (
    <FadeUp>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all
          ${toast.type === "success"
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
            : "bg-red-500/20 border border-red-500/40 text-red-400"
          }`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield size={18} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-primary">Dashboard Admin</h1>
            <p className="text-muted text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Connecté
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadPosts} disabled={postsLoading}>
            <RefreshCw size={14} className={postsLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => setView("create")}>
            <Plus size={14} />
            <span className="hidden sm:inline">Nouvel article</span>
            <span className="sm:hidden">Créer</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-muted text-xs">Articles</p>
            <p className="text-primary font-bold text-xl">{posts.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Tv size={16} className="text-amber-400" />
          </div>
          <div>
            <p className="text-muted text-xs">Animes couverts</p>
            <p className="text-primary font-bold text-xl">{uniqueAnimes}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <BarChart2 size={16} className="text-blue-400" />
          </div>
          <div>
            <p className="text-muted text-xs">Dernier article</p>
            <p className="text-primary font-bold text-sm truncate max-w-[140px]">
              {posts[0]?.titre ?? "—"}
            </p>
          </div>
        </Card>
      </div>

      {/* Liste des articles */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary">Tous les articles</h2>
        <span className="text-muted text-sm">{posts.length} article{posts.length > 1 ? "s" : ""}</span>
      </div>

      {postsLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="text-emerald-400 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-secondary mb-4">Aucun article pour le moment</p>
          <Button variant="primary" onClick={() => setView("create")}>
            <Plus size={14} /> Créer le premier article
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostRow
              key={post._id}
              post={post}
              onEdit={() => handleEdit(post)}
              onDelete={() => handleDelete(post)}
            />
          ))}
        </div>
      )}
    </FadeUp>
  );
}

// ─── Ligne d'article dans le dashboard ───────────────────────────────────────
function PostRow({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const date = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <Card className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4" hover={false}>
      {/* Image */}
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
        {post.image_url ? (
          <Image src={post.image_url} alt={post.titre} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full bg-emerald-900/30 flex items-center justify-center text-xl">🎌</div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="text-primary font-semibold text-sm leading-tight truncate">{post.titre}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="emerald">{post.anime_titre}</Badge>
          <span className="text-muted text-xs">{date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Link href={`/posts/${post._id}`} target="_blank">
          <Button variant="ghost" size="sm" aria-label="Voir">
            <Eye size={14} />
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Modifier">
          <Edit3 size={14} className="text-emerald-400" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Supprimer">
          <Trash2 size={14} className="text-red-400" />
        </Button>
      </div>
    </Card>
  );
}

// ─── Formulaire create / edit ─────────────────────────────────────────────────
function PostForm({
  post,
  onSuccess,
  onCancel,
}: {
  post?: Post;
  onSuccess: (p: Post) => void;
  onCancel: () => void;
}) {
  const isEdit = !!post;

  const [titre, setTitre] = useState(post?.titre ?? "");
  const [contenu, setContenu] = useState(post?.contenu ?? "");
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
  const [selectedAnime, setSelectedAnime] = useState<AnimeResult | null>(
    post
      ? { mal_id: post.id_anime_jikan, titre: post.anime_titre, image: "", synopsis: "", score: null, annee: null }
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAnime) { setError("Sélectionne un anime"); return; }
    if (!titre.trim()) { setError("Le titre est requis"); return; }
    if (!contenu.trim()) { setError("Le contenu est requis"); return; }

    const token = getToken();
    if (!token) { setError("Session expirée, reconnecte-toi"); return; }

    setSubmitting(true);
    setError("");

    try {
      let result: Post;
      if (isEdit && post) {
        result = await updatePost(
          post._id,
          {
            titre,
            contenu,
            id_anime_jikan: selectedAnime.mal_id,
            anime_titre: selectedAnime.titre,
            image_url: imageUrl || null,
          },
          token
        );
      } else {
        result = await createPost(
          {
            titre,
            contenu,
            id_anime_jikan: selectedAnime.mal_id,
            anime_titre: selectedAnime.titre,
            image_url: imageUrl || undefined,
          },
          token
        );
      }
      onSuccess(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Anime */}
      <Card className="p-4 sm:p-5">
        <label className="text-secondary text-sm mb-4 block font-medium">
          🎌 Anime associé <span className="text-red-400">*</span>
        </label>
        <AnimeSelector onSelect={setSelectedAnime} selected={selectedAnime} />
      </Card>

      {/* Titre */}
      <Card className="p-4 sm:p-5">
        <label className="text-secondary text-sm mb-3 block font-medium">
          ✏️ Titre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Mon avis sur Attack on Titan..."
          maxLength={200}
          className="w-full bg-transparent text-primary text-lg font-semibold placeholder:text-muted focus:outline-none border-b border-black/10 dark:border-white/10 pb-2 focus:border-emerald-500/50 transition-colors"
        />
        <p className="text-muted text-xs mt-2 text-right">{titre.length}/200</p>
      </Card>

      {/* Contenu */}
      <Card className="p-4 sm:p-5">
        <label className="text-secondary text-sm mb-3 block font-medium">
          📝 Contenu <span className="text-red-400">*</span>
        </label>
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écris ton analyse, ton avis, tes impressions..."
          rows={10}
          className="w-full bg-transparent text-secondary placeholder:text-muted focus:outline-none resize-none leading-relaxed"
        />
        <p className="text-muted text-xs mt-2 text-right">{contenu.length} caractères</p>
      </Card>

      {/* Image */}
      <Card className="p-4 sm:p-5">
        <label className="text-secondary text-sm mb-3 block font-medium">
          🖼️ Image de couverture
        </label>
        <ImageDropzone onUpload={setImageUrl} token={getToken() || ""} />
      </Card>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm glass border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="flex-1">
          {submitting
            ? <><Loader2 size={18} className="animate-spin" /> {isEdit ? "Mise à jour..." : "Publication..."}</>
            : <><Save size={18} /> {isEdit ? "Enregistrer les modifications" : "Publier l'article"}</>
          }
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onCancel} className="sm:w-auto">
          <X size={16} /> Annuler
        </Button>
      </div>
    </form>
  );
}
