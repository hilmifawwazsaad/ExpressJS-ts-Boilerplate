# src/config/

Folder ini menyimpan semua konfigurasi aplikasi — environment variables, koneksi database, konfigurasi third-party service, dan konstanta global.

## Kegunaan

- Membaca dan memvalidasi environment variables dari `.env`
- Menyediakan konfigurasi yang type-safe ke seluruh aplikasi
- Mengelola konfigurasi per-environment (development, staging, production)
- Menghindari penggunaan `process.env` secara langsung di luar folder ini

## Struktur yang Disarankan

```
src/config/
├── env.ts           # Baca dan validasi semua env vars
├── database.ts      # Konfigurasi koneksi database
└── app.ts           # Konstanta aplikasi (port, base URL, dsb.)
```

## Contoh Penggunaan

**`src/config/env.ts`**

```typescript
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
} as const;
```

**`src/config/database.ts`**

```typescript
import { PrismaClient } from '@prisma/client';
import { env } from './env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.nodeEnv !== 'production') globalForPrisma.prisma = prisma;
```

## Dipanggil dari

Config diimpor langsung oleh layer manapun yang membutuhkan — services, repositories, middlewares, hingga `app.ts`.

```typescript
// src/services/auth.service.ts
import { env } from '@/config/env';

const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
```
