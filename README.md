# Express.js + TypeScript Boilerplate

Boilerplate REST API menggunakan Express.js dan TypeScript dengan pendekatan **Layered Architecture** — memisahkan setiap tanggung jawab ke dalam lapisan yang jelas dan terstruktur.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Dev Tools**: ts-node, nodemon

## Arsitektur

Proyek ini menggunakan **Layered Architecture** (arsitektur berlapis). Setiap HTTP request mengalir melalui lapisan-lapisan berikut secara berurutan:

```
HTTP Request
    │
    ▼
src/routes/          → Definisi path dan method endpoint
    │
    ▼
src/middlewares/     → Auth, validasi, rate limiting, error handling
    │
    ▼
src/validations/     → Schema validasi request (body, params, query)
    │
    ▼
src/handlers/        → Controller tipis — terima input, panggil service, kirim respons
    │
    ▼
src/services/        → Logika bisnis domain
    │
    ▼
src/repositories/    → Akses data (query database, API eksternal)
    │
    ▼
src/models/          → Definisi entitas dan struktur data
```

Layer pendukung (cross-cutting):

```
src/config/          → Konfigurasi environment dan koneksi
src/types/           → TypeScript interfaces dan type definitions
src/utils/           → Helper dan fungsi umum
```

## Struktur Folder

```
src/
├── index.ts                  # Entry point — inisialisasi server
├── app.ts                    # Setup Express app, middleware global, routes
├── config/                   # Konfigurasi (env, database, dsb.)
├── handlers/                 # Route handlers / controllers
├── middlewares/              # Express middleware
├── models/                   # Definisi entitas / model data
├── repositories/             # Data access layer
├── routes/                   # Definisi routing
├── services/                 # Logika bisnis
├── types/                    # TypeScript type definitions
├── utils/                    # Fungsi helper dan utilitas
└── validations/              # Schema validasi request
```

Setiap folder memiliki `README.md` tersendiri yang menjelaskan konvensi, struktur yang disarankan, dan contoh penggunaan.

## Memulai

### Prasyarat

- Node.js >= 18
- pnpm >= 10

### Instalasi

```bash
pnpm install
```

### Menjalankan Server

```bash
# Development (hot reload)
pnpm dev

# Production
pnpm build
pnpm start
```

### Lint & Format

```bash
pnpm lint              # Cek ESLint
pnpm lint:fix          # Auto-fix ESLint
pnpm lint:strict       # ESLint strict — zero warnings (dipakai di pre-push)
pnpm format            # Format seluruh src/ dengan Prettier
pnpm format:check      # Cek format tanpa menulis
```

## Git Hooks (Husky)

| Hook         | Trigger            | Aksi                                                  |
| ------------ | ------------------ | ----------------------------------------------------- |
| `pre-commit` | Sebelum commit     | Jalankan `lint-staged` (lint + format staged files)   |
| `commit-msg` | Saat commit        | Validasi format pesan commit (Conventional Commits)   |
| `pre-push`   | Sebelum push       | Jalankan `lint:strict` — blokir push jika ada warning |
| `post-merge` | Setelah merge/pull | Jalankan `pnpm install` otomatis                      |

### Format Commit Message

Menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

feat(auth): add JWT authentication
fix(user): handle null email on registration
refactor(service): simplify pagination logic
docs: update README
chore: upgrade dependencies
```

Tipe yang tersedia: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`, `build`, `revert`
