"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PenSquare, LogIn, Loader2, CheckCircle, AlertCircle, LogOut } from "lucide-react";
import { AnimeSelector } from "@/components/search/AnimeSelector";
import { ImageDropzone } from "@/components/create/ImageDropzone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimeResult } from "@/types";
import { createPost } from "@/lib/api";
import { getToken, setToken, isLoggedIn, login, removeToken } from "@/lib/auth";
import { FadeUp } from "@/components/ui/MotionWrapper";

export function CreatePostForm() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<AnimeResult | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setLoggedIn(isLoggedIn()); }, []);

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    router.push("/");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAnime) { setError("Sélectionne un anime"); return; }
    if (!titre.trim()) { setError("Le titre est requis"); return; }
    if (!contenu.trim()) { setError("Le contenu est requis"); return; }

    const token = getToken();
    if (!token) { setLoggedIn(false); return; }

    setSubmitting(true);
    setError("");
    try {
      const post = await createPost(
        { titre, contenu, id_anime_jikan: selectedAnime.mal_id, anime_titre: selectedAnime.titre, image_url: imageUrl || undefined },
        token
      );
      setSuccess(true);
      setTimeout(() => router.push(`/posts/${post._id}`), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Écran login ────────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <FadeUp>
        <Card className="p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <LogIn size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">Connexion admin</h2>
              <p className="text-white/40 text-sm">Réservé à l&apos;administratrice</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@aninoren.com" required
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Mot de passe</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all" />
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
      </FadeUp>
    );
  }

  // ── Succès ─────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <FadeUp>
        <Card className="p-12 text-center">
          <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Article publié !</h2>
          <p className="text-white/40">Redirection en cours...</p>
        </Card>
      </FadeUp>
    );
  }

  // ── Formulaire ─────────────────────────────────────────────────────────────
  return (
    <FadeUp>
      {/* Bandeau admin connecté */}
      <div className="flex items-center justify-between glass border border-emerald-500/20 rounded-xl px-4 py-2.5 mb-6">
        <span className="text-emerald-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Connectée en tant qu&apos;admin
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors"
        >
          <LogOut size={13} />
          Déconnexion
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── Sélection anime ── */}
        <Card className="p-5">
          <label className="text-white/60 text-sm mb-4 block font-medium">
            🎌 Anime associé <span className="text-red-400">*</span>
          </label>
          <AnimeSelector onSelect={setSelectedAnime} selected={selectedAnime} />
        </Card>

        {/* ── Titre ── */}
        <Card className="p-5">
          <label className="text-white/60 text-sm mb-3 block font-medium">
            ✏️ Titre de l&apos;article <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Mon avis sur Attack on Titan..."
            maxLength={200}
            className="w-full bg-transparent text-white text-lg font-semibold placeholder:text-white/20 focus:outline-none border-b border-white/10 pb-2 focus:border-emerald-500/50 transition-colors"
          />
          <p className="text-white/20 text-xs mt-2 text-right">{titre.length}/200</p>
        </Card>

        {/* ── Contenu ── */}
        <Card className="p-5">
          <label className="text-white/60 text-sm mb-3 block font-medium">
            📝 Contenu <span className="text-red-400">*</span>
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Écris ton analyse, ton avis, tes impressions..."
            rows={10}
            className="w-full bg-transparent text-white/80 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
          />
          <p className="text-white/20 text-xs mt-2 text-right">{contenu.length} caractères</p>
        </Card>

        {/* ── Image ── */}
        <Card className="p-5">
          <label className="text-white/60 text-sm mb-3 block font-medium">
            🖼️ Image de couverture
          </label>
          <ImageDropzone onUpload={setImageUrl} token={getToken() || ""} />
        </Card>

        {/* ── Erreur ── */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm glass border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* ── Submit ── */}
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
          {submitting
            ? <><Loader2 size={18} className="animate-spin" /> Publication en cours...</>
            : <><PenSquare size={18} /> Publier l&apos;article</>
          }
        </Button>
      </form>
    </FadeUp>
  );
}
