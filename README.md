# Book Hive

> A quiet room for readers. Track what you read, share what you love, find your next chapter.

Book Hive is a social reading tracker — track books, follow other readers, write
markdown notes per book, and (soon) browse a feed of activity from people you
follow. Books come from the Open Library API and are cached in MongoDB on first
hit.

This repository is the **Phase 1** delivery: a production-shaped Next.js
application with the full data model in place and a complete, secure
authentication system. See [Roadmap](#roadmap) for what comes next.

---

## Stack

| Layer            | Choice                                                                     |
| ---------------- | -------------------------------------------------------------------------- |
| Framework        | Next.js 15 (App Router) + TypeScript (strict)                              |
| Database         | MongoDB + Mongoose                                                         |
| Auth             | JWT via [`jose`](https://github.com/panva/jose) (edge-compatible) + bcrypt |
| Validation       | Zod (shared client + server schemas)                                       |
| UI               | Tailwind v4 + shadcn/ui (new-york) + Fraunces / Manrope                    |
| Forms            | react-hook-form + `@hookform/resolvers/zod`                                |
| Client state     | Zustand                                                                    |
| Server state     | TanStack Query                                                             |
| Toasts           | sonner                                                                     |
| Themes           | next-themes (light / dark / system)                                        |
| Testing          | Jest + Testing Library + mongodb-memory-server                             |

---

## Getting started

### Prerequisites

- Node 20+ (developed on 24)
- pnpm 10+
- MongoDB (local or Atlas) — alternatively, the test suite spins up an
  ephemeral in-memory instance.

### Setup

```bash
pnpm install
cp .env.example .env.local
# fill MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
# generate secrets with: openssl rand -base64 48
pnpm dev
```

Open <http://localhost:3000>.

### Scripts

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Run Next.js in development           |
| `pnpm build`        | Production build                     |
| `pnpm start`        | Serve the production build           |
| `pnpm lint`         | Next + ESLint                        |
| `pnpm typecheck`    | `tsc --noEmit`                       |
| `pnpm test`         | Run the full Jest test suite         |
| `pnpm test:watch`   | Jest in watch mode                   |

---

## Environment variables

| Variable              | Required | Default                  | Notes                                                |
| --------------------- | -------- | ------------------------ | ---------------------------------------------------- |
| `MONGODB_URI`         | yes      | —                        | `mongodb://…` or `mongodb+srv://…`                   |
| `JWT_ACCESS_SECRET`   | yes      | —                        | ≥32 chars; **must differ** from `JWT_REFRESH_SECRET` |
| `JWT_REFRESH_SECRET`  | yes      | —                        | ≥32 chars                                            |
| `JWT_ACCESS_TTL`      | no       | `15m`                    | Any `jose`-compatible duration                       |
| `JWT_REFRESH_TTL`     | no       | `7d`                     | Any `jose`-compatible duration                       |
| `NEXT_PUBLIC_APP_URL` | no       | `http://localhost:3000`  | Used for SEO metadata & cookie scoping               |

`src/lib/env.ts` validates these via Zod **at module load**, so misconfiguration
fails fast rather than mid-request.

---

## Architecture

### Folder layout

```
src/
├── app/
│   ├── (auth)/                # login + register pages
│   ├── (app)/                 # protected pages (RSC auth gate via getSession)
│   ├── api/auth/              # 5 route handlers: register/login/logout/refresh/me
│   ├── layout.tsx             # providers, fonts, dark mode
│   └── page.tsx               # marketing landing
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── auth/                  # LoginForm, RegisterForm, AuthShell
│   ├── layout/                # Header, Footer, Logo, ThemeToggle
│   └── providers/             # Theme, Query, AuthBootstrap
├── lib/
│   ├── api/                   # response envelope, errors, validate, rate-limit
│   ├── auth/                  # password, jwt, cookies, session, guards
│   ├── db/connect.ts          # cached mongoose connection (serverless-safe)
│   ├── env.ts                 # Zod-validated env
│   └── utils.ts               # cn()
├── models/                    # 9 Mongoose schemas (see below)
├── services/auth.service.ts   # registerUser / loginUser / rotateRefresh / logoutUser
├── schemas/auth.schema.ts     # Zod schemas shared by client + server
├── store/auth.store.ts        # Zustand client cache, hydrated from /api/auth/me
├── hooks/use-auth.ts          # useAuth() — convenience wrapper around the store
├── types/                     # PublicUser, etc.
└── middleware.ts              # Edge middleware: gates /dashboard etc., redirects authed users away from /login
```

### Authentication design

- **Access token** — `jose`-signed JWT (HS256), 15-min TTL, stored in an
  `httpOnly` + `SameSite=Lax` cookie named `bh_at`.
- **Refresh token** — 7-day TTL, `httpOnly` + `SameSite=Strict` cookie scoped
  to `/api/auth`, named `bh_rt`. Each refresh **rotates** the token and revokes
  the prior `jti` in the `RefreshToken` collection.
- **CSRF** — a non-`httpOnly` cookie `bh_csrf` is set alongside auth cookies.
  Mutating routes require the client to echo it back via the `x-csrf-token`
  header (double-submit pattern). Combined with `SameSite=Lax/Strict` this
  defends against forged requests.
- **RBAC** — role lives on the access token payload; `requireRole(req, 'admin')`
  guard wraps protected handlers.
- **Edge middleware** — verifies the access token (via `jose`, edge-safe) and
  performs cheap redirects. It does **not** query MongoDB.

### API envelope

All responses follow:

```ts
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ApiErrorCode; message: string; details?: unknown } };
```

HTTP status codes remain meaningful (200/201/401/403/409/422/429/500).

### Database

Nine Mongoose models, with indexes & validation:

| Model             | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `User`            | account, profile, role, follower counts                    |
| `Book`            | cached Open Library metadata (Phase 2 populates)           |
| `Note`            | per-user/per-book markdown notes with public/private vis.  |
| `Follow`          | follower → followee relationships                          |
| `ReadingProgress` | per-user/per-book status + page/percentage                 |
| `Activity`        | feed events (started/completed/posted_note/…)              |
| `Review`          | per-user/per-book rating + content                         |
| `ReadingGoal`     | per-user yearly book/page targets                          |
| `RefreshToken`    | auth infra: jti, expiresAt (TTL-indexed), revocation chain |

### Rate limiting

`src/lib/api/rate-limit.ts` ships an in-memory token-bucket limiter for
`/api/auth/*` (10 req/min/IP). The `RateLimiter` interface lets you swap in
`@upstash/ratelimit` for production — required on Vercel, where serverless
functions don't share memory.

---

## Testing

```bash
pnpm test
```

Phase-1 coverage:

- **`tests/server/password.unit.test.ts`** — bcrypt hash/compare semantics & salt randomness
- **`tests/server/jwt.unit.test.ts`** — sign/verify, cross-secret confusion, tampering
- **`tests/server/auth-schema.unit.test.ts`** — Zod `registerSchema` / `loginSchema`
- **`tests/server/auth-service.integration.test.ts`** — register/login/refresh-rotation/logout against an ephemeral in-memory MongoDB

The integration suite downloads a MongoDB binary on first run (cached in
`~/.cache/mongodb-binaries`).

---

## Deployment

Targeted at **Vercel** with **MongoDB Atlas**.

1. Push to GitHub, import the repo into Vercel.
2. Add the env vars from `.env.example`. Generate the JWT secrets with
   `openssl rand -base64 48` — they MUST differ.
3. In Atlas, allow Vercel's egress IPs (or use connection-string credentials
   plus `0.0.0.0/0`).
4. Before going live, swap the in-memory rate limiter for an Upstash-backed
   one (see "Rate limiting" above).

---

## Roadmap

**Phase 1 (this release) — Foundation + Auth**

- [x] Next.js + Tailwind v4 + shadcn/ui scaffold
- [x] 9 Mongoose models with indexes & TTL cleanup
- [x] Edge-runtime-safe auth (jose), refresh rotation, CSRF, RBAC
- [x] Login / register / dashboard landing + marketing landing page
- [x] Tests for password, JWT, schemas, auth service

**Phase 2 — Books & Reading**

- [ ] Open Library search + on-first-hit Mongo caching
- [ ] Book detail pages
- [ ] Reading lists (`want_to_read`, `currently_reading`, `completed`, `dropped`)
- [ ] Progress tracking (current page / percentage)
- [ ] Ratings + reviews

**Phase 3 — Notes & Profiles**

- [ ] Markdown notes with visibility controls
- [ ] Public profile pages
- [ ] Avatar upload
- [ ] Settings page

**Phase 4 — Social**

- [ ] Follow / unfollow
- [ ] Activity feed (pagination + infinite scroll)
- [ ] Notifications

**Phase 5 — Polish**

- [ ] Dashboard (stats, streak, goals, graphs)
- [ ] Admin moderation UI
- [ ] Docker + CI

---

## License

ISC
