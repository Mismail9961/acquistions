# =============================================================================
# Stage 1 — development
# All dependencies (including devDeps), runs with --watch for hot reload.
# Used by docker-compose.dev.yml via: build.target: development
# =============================================================================
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]

# =============================================================================
# Stage 2 — prod-deps (intermediate)
# Installs only production dependencies for a lean final image.
# =============================================================================
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# =============================================================================
# Stage 3 — production (default)
# Lean image: no devDependencies, no source maps, no tooling.
# Used by docker-compose.prod.yml via: build.target: production
# =============================================================================
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy only the production node_modules from the prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy application source
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
