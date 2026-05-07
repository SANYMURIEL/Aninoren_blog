"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/api";

interface ImageDropzoneProps {
  onUpload: (url: string) => void;
  token: string;
}

export function ImageDropzone({ onUpload, token }: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Seules les images sont acceptées");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5MB");
        return;
      }

      setError(null);
      // Prévisualisation locale immédiate
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setUploading(true);

      try {
        const result = await uploadImage(file, token);
        onUpload(result.url);
      } catch {
        setError("Erreur lors de l'upload. Vérifie ta connexion.");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [token, onUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  function clearImage() {
    setPreview(null);
    onUpload("");
  }

  return (
    <div className="w-full">
      {preview ? (
        // Prévisualisation
        <div className="relative rounded-xl overflow-hidden h-48 group">
          <Image src={preview} alt="Preview" fill className="object-cover" sizes="100vw" />
          {/* Overlay upload en cours */}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2">
              <Loader2 size={20} className="text-emerald-400 animate-spin" />
              <span className="text-white text-sm">Upload en cours...</span>
            </div>
          )}
          {/* Bouton supprimer */}
          {!uploading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
            >
              <X size={14} className="text-white" />
            </button>
          )}
        </div>
      ) : (
        // Zone de drop
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
              : "border-white/10 hover:border-emerald-500/40 hover:bg-white/5"
          )}
        >
          <input type="file" accept="image/*" className="hidden" onChange={onInputChange} />
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-emerald-500/20" : "bg-white/5"
          )}>
            {isDragging ? (
              <Upload size={20} className="text-emerald-400" />
            ) : (
              <ImageIcon size={20} className="text-white/30" />
            )}
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">
              {isDragging ? "Relâche pour uploader" : "Glisse une image ici"}
            </p>
            <p className="text-white/30 text-xs mt-1">ou clique pour choisir • JPG, PNG, WebP • max 5MB</p>
          </div>
        </label>
      )}

      {error && (
        <p className="mt-2 text-red-400 text-xs flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}
