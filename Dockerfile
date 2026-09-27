# syntax=docker/dockerfile:1

# ─── Build stage ─────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies against the lockfile for a reproducible build.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Build the Nitro server + client bundle.
COPY . .
RUN npm run build

# ─── Runtime stage ───────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy the built app, dependencies and the source needed for migrations /
# seeding, owned by the unprivileged `node` user.
COPY --from=build --chown=node:node /app ./

USER node
EXPOSE 3000

# entrypoint dispatches on the command: "migrate" or "serve" (default).
ENTRYPOINT ["/bin/sh", "docker/entrypoint.sh"]
CMD ["serve"]
