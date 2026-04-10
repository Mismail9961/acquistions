# Acquisitions API

Node.js (Express) API using Drizzle ORM and [Neon](https://neon.com) Postgres.

## How database access works

| Environment              | `DATABASE_URL` points to                       | Neon Local                          |
| ------------------------ | ---------------------------------------------- | ----------------------------------- |
| **Development (Docker)** | `neon-local` (Compose service) — proxy to Neon | Yes — ephemeral branches by default |
| **Development (host)**   | `localhost:5432` — same proxy, port published  | Yes (container)                     |
| **Production**           | `*.neon.tech` (Neon Cloud)                     | No                                  |

The app always reads **`DATABASE_URL`** from the environment. Switching dev vs prod is done by **which file or secret store** supplies that variable, not by changing application code.

For the **`@neondatabase/serverless`** driver against Neon Local, the app sets **`NEON_LOCAL=true`** so queries use Neon Local’s HTTP SQL endpoint (`/sql`). Production leaves `NEON_LOCAL` unset and uses Neon’s cloud endpoints from the connection string.

---

## Prerequisites

- Docker and Docker Compose v2.20+ (for `include` in the default `docker-compose.yml`; otherwise use `-f docker-compose.dev.yml` explicitly)
- A Neon project, API key, and project ID ([Neon docs](https://neon.com/docs/manage/api-keys))

---

## Local development with Neon Local (Docker)

Neon Local runs as a container that proxies to Neon and can **create an ephemeral database branch** when the container starts and remove it when the container stops (unless you configure persistence — see [Neon Local](https://neon.com/docs/local/neon-local)).

1. Copy the example env file and fill in Neon credentials:

   ```bash
   cp .env.development.example .env.development
   ```

   Set at least `NEON_API_KEY`, `NEON_PROJECT_ID`, and ensure `DATABASE_URL` uses host **`neon-local`** (inside Compose) and database name **`neondb`** (or your real DB name).

   Compose also reads `NEON_API_KEY` and `NEON_PROJECT_ID` from the environment or from a `.env` file in the project root (Compose’s default env file), so you may put those in `.env` if you prefer not to duplicate them in `.env.development`.

2. Start the stack:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   Or, if your Compose version supports `include`:

   ```bash
   docker compose up --build
   ```

3. API: `http://localhost:3000` (override with `APP_PORT`). Neon Local Postgres port on the host defaults to **5432**; change with `NEON_LOCAL_HOST_PORT` if that conflicts with a local Postgres.

4. Run migrations against Neon Local when the proxy is up, for example:

   ```bash
   DATABASE_URL='postgres://neon:npg@localhost:5432/neondb' npm run db:migrate
   ```

   Use the same database name as in Neon. For the **serverless** driver inside the app, `NEON_LOCAL=true` is required; Drizzle Kit migrations use the URL with the normal Postgres driver.

---

## Local development without Docker (app on host, Neon Local in Docker)

1. Run only Neon Local:

   ```bash
   docker run --rm -p 5432:5432 \
     -e NEON_API_KEY="$NEON_API_KEY" \
     -e NEON_PROJECT_ID="$NEON_PROJECT_ID" \
     neondatabase/neon_local:latest
   ```

2. In `.env.development` (or `.env`):
   - `DATABASE_URL=postgres://neon:npg@localhost:5432/neondb`
   - `NEON_LOCAL=true`
   - `NEON_LOCAL_HOST=localhost`

3. `npm run dev`

---

## Production (Neon Cloud, no Neon Local)

1. Copy and fill production env **on the server or in your CI/CD secrets**, not in git:

   ```bash
   cp .env.production.example .env.production
   ```

2. Set **`DATABASE_URL`** to the connection string from the Neon console (host under `*.neon.tech`). Do **not** set `NEON_LOCAL`.

3. Run with Compose:

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

   In Kubernetes, Fly.io, ECS, etc., inject the same variables; you do not run the `neon-local` image in production.

`docker-compose.prod.yml` defines **only the `app` service**. “Serverless Neon” here means Neon’s **hosted** serverless Postgres — there is no second database container in Compose.

---

## Docker images

| File                      | Purpose                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Dockerfile`              | Multi-stage: `development` (full deps + `node --watch`), `production` (prod deps only, default target) |
| `docker-compose.dev.yml`  | `app` + `neon-local`                                                                                   |
| `docker-compose.prod.yml` | `app` only, `DATABASE_URL` → Neon Cloud                                                                |
| `docker-compose.yml`      | Includes the dev stack for a simple `docker compose up`                                                |

---

## Environment variables (summary)

| Variable           | Development (Neon Local)                                                       | Production                |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------- |
| `DATABASE_URL`     | `postgres://neon:npg@neon-local:5432/...` (Compose) or `@localhost` (host app) | Neon Cloud URL            |
| `NEON_LOCAL`       | `true`                                                                         | unset / omitted           |
| `NEON_LOCAL_HOST`  | `neon-local` or `localhost`                                                    | unset                     |
| `NEON_API_KEY`     | Required for **Neon Local** container                                          | Not used by app container |
| `NEON_PROJECT_ID`  | Required for **Neon Local** container                                          | Not used by app container |
| `PARENT_BRANCH_ID` | Optional; parent for **ephemeral** branches                                    | N/A                       |

---

## License

ISC
