# src/types/

Folder ini menyimpan TypeScript type definitions dan interface yang digunakan secara lintas-lapisan — terutama augmentasi type dari library eksternal dan type utilitas umum.

## Kegunaan

- Memperluas (augment) type bawaan Express — misalnya menambahkan `user` ke `Request`
- Mendefinisikan type untuk response API yang konsisten
- Menyimpan type utilitas yang tidak spesifik ke satu domain
- Berbeda dengan `models/` yang berisi entitas domain, `types/` berisi type infrastruktur dan utilitas

## Struktur yang Disarankan

```
src/types/
├── express.d.ts        # Augmentasi Express Request dan Response
├── api.types.ts        # Type untuk format response API
└── common.types.ts     # Type utilitas umum
```

## Contoh Penggunaan

**`src/types/express.d.ts`** — Augmentasi Express Request agar `req.user` dikenali TypeScript:

```typescript
import { UserRole } from '@/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
```

**`src/types/api.types.ts`** — Format response API yang konsisten:

```typescript
export interface ApiResponse<T = null> {
  success: boolean;
  data: T;
  message: string;
  error: unknown;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  message: string;
  error: unknown;
}
```

**`src/types/common.types.ts`**

```typescript
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;
```

## Cara TypeScript Membaca File `.d.ts`

File `express.d.ts` dikenali otomatis oleh TypeScript karena menggunakan `declare global`. Pastikan `tsconfig.json` menyertakan folder ini:

```json
{
  "include": ["src/**/*"]
}
```
