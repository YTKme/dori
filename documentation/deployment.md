# Deployment

Dori is designed to run as a self-contained appliance via Docker Compose:
the application, PostgreSQL 18 and Redis, with no external dependencies.

## Steps

```bash
cp .env.example .env
```

Edit `.env` and set, at minimum:

- `BETTER_AUTH_SECRET` — `openssl rand -base64 48`
- `BETTER_AUTH_URL` / `DORI_APPLICATION_URL` — the public URL
- `DORI_POSTGRESQL_PASSWORD`, `DORI_REDIS_PASSWORD` — strong secrets
- `DORI_SEED="true"` to plant demo data on first boot (optional)

Then:

```bash
docker compose up -d
```

Compose brings up four services:

| Service | Role |
|---|---|
| `postgres` | PostgreSQL 18 (named volume, healthcheck) |
| `redis` | Redis 8, password-protected (named volume, healthcheck) |
| `migrate` | One-shot: waits for Postgres, runs migrations, optional seed |
| `app` | The server (`node .output/server/index.mjs`), published on the app port |

The `app` service starts only after `migrate` completes successfully.
Database and Redis ports are **not** published to the host.

## Upgrades

```bash
git pull
docker compose build
docker compose up -d      # `migrate` applies any new migrations first
```

## Security notes

- The image runs as the non-root `node` user; secrets are provided at runtime
  (never baked into the image — see [`.dockerignore`](../.dockerignore)).
- Put a TLS-terminating reverse proxy in front of the app in production and set
  `DORI_APPLICATION_SCHEME="https"` / `BETTER_AUTH_URL` accordingly.
- Back up the `postgres-data` volume.
