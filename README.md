# BRETHRENFGM Platform

A full-stack member management platform for the Mission du Plein Évangile (MPE) in Cameroon. The solution is composed of a Node.js/Express API secured with JWT, a PostgreSQL database managed via Prisma, real-time messaging through Socket.IO, and an Angular front-end powered by NgRx for state management.

## Repository structure

```
backend/   # Node.js API, WebSocket server, Prisma ORM
frontend/  # Angular application with NgRx store
Brethren.pdf
README.md
```

## Tech stack

| Layer        | Technology                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| API          | Node.js (TypeScript), Express, Prisma ORM, Socket.IO, Zod validation        |
| Database     | PostgreSQL (recommended with PostGIS for geospatial features)               |
| Front-end    | Angular 17 (standalone components), NgRx Store/Effects, RxJS, Socket.IO     |
| Tooling      | Vitest, Jasmine/Karma, ESLint + Prettier, Docker (optional)                 |

## Local development

### 1. Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (Docker instructions below)

### 2. Clone and bootstrap

```bash
git clone <repository-url>
cd MPE-APP
```

### 3. Backend setup

```bash
cd backend
cp .env.example .env
# Update DATABASE_URL, JWT_SECRET, and other settings in .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # optional: will create default roles and a national admin account
npm run dev
```

By default the API listens on `http://localhost:4000/api`. The Socket.IO server shares the same port.

### 4. Front-end setup

In a new shell:

```bash
cd frontend
npm install
npm start
```

The Angular dev server runs on `http://localhost:4200` and proxies API calls directly to the backend URL specified in `src/environments/environment.ts` (`http://localhost:4000/api` by default).

### 5. Docker-based workflow (optional)

Create a `docker-compose.yml` with services for PostgreSQL, backend, and frontend. Example snippet:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: brethrenfgm
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on:
      - db
  frontend:
    build: ./frontend
    depends_on:
      - backend
volumes:
  postgres-data:
```

## Backend highlights

- **Domain models:** Region → District → Assembly → Member, Ministries, Events, Circulars, Users & Roles.
- **Authentication:** JWT-based login, role guard middleware (`authenticate`) for RBAC enforcement.
- **Statistics:** Aggregates by scope (national, region, district, assembly) exposed at `/api/statistics`.
- **Live chat:** Socket.IO listeners storing direct messages with persistence in PostgreSQL.
- **Validation:** Zod schemas can be added alongside controllers to enforce payload integrity.
- **Testing:** Vitest unit tests (`npm test`).

### Maintenance tasks

| Task                        | Command(s)                                     |
| --------------------------- | --------------------------------------------- |
| Format & lint               | `npm run lint`                                 |
| Unit tests                  | `npm test`                                     |
| Generate Prisma client      | `npm run prisma:generate`                      |
| Apply migrations (dev)      | `npm run prisma:migrate`                       |
| Deploy migrations (prod)    | `npm run prisma:deploy`                        |
| Seed reference data         | `npm run prisma:seed`                          |

### Deployment checklist (backend)

1. Build the TypeScript project with `npm run build`.
2. Run database migrations against the production database: `npm run prisma:deploy`.
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `UPLOAD_DIR`).
4. Use a process manager (PM2, systemd) or container orchestrator to run `npm run start`.
5. Configure HTTPS and reverse proxy (Nginx/Traefik) to expose `/api` and the Socket.IO endpoint.
6. Rotate the default admin credentials created by the seed script immediately after deployment.

## Front-end highlights

- **Architecture:** Standalone components with a Core/Shared/Features folder layout.
- **State management:** NgRx Store handles statistics data; Effects call the backend API.
- **UI:** Responsive dashboard cards with statistics overview component ready for further expansion.
- **Testing:** Jasmine/Karma specs for the root and dashboard components.

### Maintenance tasks

| Task                  | Command          |
| --------------------- | ---------------- |
| Lint                  | `npm run lint`   |
| Unit tests            | `npm test`       |
| Build for production  | `npm run build`  |

### Deployment checklist (frontend)

1. Update `src/environments/environment.prod.ts` with the production API URL if needed.
2. Run `npm run build` to create the production bundle in `dist/brethrenfgm`.
3. Serve the static files via an HTTP server (Nginx, Apache, or a CDN). Configure the backend proxy to forward `/api` to the Node.js service.
4. Enable caching headers for static assets and gzip/brotli compression for faster load times.

## Database operations

- To inspect the schema after migrations, run `npx prisma studio` from the backend directory.
- For geospatial features (assembly coordinates, mission fields), enable the PostGIS extension in PostgreSQL: `CREATE EXTENSION IF NOT EXISTS postgis;`
- Schedule regular backups (e.g., `pg_dump`) and create read replicas for analytics workloads.

## Real-time messaging

- Clients connect to the Socket.IO server at the backend URL.
- Emit `join` with the authenticated user ID to receive private messages.
- Send messages via the `private-message` event payload `{ senderId, receiverId, content }`.

## Continuous integration & delivery (recommended)

- **Lint & test:** Run `npm run lint` and `npm test` in both `backend/` and `frontend/` on every push.
- **Build artifacts:** Publish backend build output (`backend/dist`) and Angular bundle (`frontend/dist/brethrenfgm`).
- **Deploy:** Use environments (staging → production) with automatic migrations and smoke tests.

## Security best practices

- Store secrets in a secure vault (GitHub Actions Secrets, HashiCorp Vault, etc.).
- Enforce HTTPS everywhere and use `helmet` for secure HTTP headers.
- Rate-limit login endpoints and monitor for repeated failures.
- Implement audit logging for CRUD operations on sensitive data (members, transfers, finances).
- Keep dependencies updated (`npm outdated`, Renovate/Dependabot).

## Roadmap ideas

- Add advanced filtering and pagination for members.
- Integrate Google Maps/Mapbox for assembly geolocation and mission-field heatmaps.
- Implement circular distribution workflows with granular approval chains.
- Extend chat with typing indicators, group discussions, and push notifications.
- Provide BI dashboards with historical trends, CSV/PDF exports, and scheduled reports.

## Support & contributions

1. Fork the repository and create feature branches (`feat/<feature-name>`).
2. Follow the established linting and testing workflows before opening a pull request.
3. Document architectural or API changes in the README or a dedicated `docs/` folder.
4. Use semantic commit messages (`feat:`, `fix:`, `docs:`) to keep history clean.
