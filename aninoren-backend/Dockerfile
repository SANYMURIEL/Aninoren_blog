# ─── Phase 1 : Build ───────────────────────────────────────
# On part d'une image Node.js légère (alpine)
FROM node:20-alpine AS builder

WORKDIR /app

# On copie les fichiers de dépendances en premier
# (optimisation : si package.json n'a pas changé, Docker réutilise le cache)
COPY package*.json ./

# Installation de TOUTES les dépendances (dev incluses pour compiler)
RUN npm ci

# On copie le reste du code source
COPY . .

# Compilation TypeScript → JavaScript dans /app/dist
RUN npm run build

# ─── Phase 2 : Production ──────────────────────────────────
# Nouvelle image propre, sans les outils de dev
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# On récupère uniquement le dossier compilé de la phase précédente
COPY --from=builder /app/dist ./dist

# Port exposé (Render le détecte automatiquement)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/main"]
