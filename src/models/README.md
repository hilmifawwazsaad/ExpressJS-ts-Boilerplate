# src/models/

Folder ini menyimpan definisi entitas dan model data aplikasi — representasi TypeScript dari struktur data yang digunakan di seluruh aplikasi.

## Kegunaan

- Mendefinisikan interface dan type untuk entitas domain (User, Post, dsb.)
- Menyimpan enum dan konstanta yang berkaitan dengan model data
- Menjadi referensi terpusat untuk struktur data aplikasi
- Berbeda dengan `types/` yang berisi type utilitas umum, `models/` berisi entitas domain bisnis

> **Catatan:** Jika menggunakan Prisma, model database sudah didefinisikan di `schema.prisma`. Folder ini digunakan untuk interface tambahan, tipe response, atau model yang tidak langsung merepresentasikan tabel database.

## Struktur yang Disarankan

```
src/models/
├── user.model.ts       # Interface dan type entitas user
├── auth.model.ts       # Interface terkait autentikasi
└── post.model.ts       # Interface entitas konten
```

## Contoh Penggunaan

**`src/models/user.model.ts`**

```typescript
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Representasi user yang aman dikirim ke client (tanpa password)
export type PublicUser = Omit<User, 'password'>;

// Response dengan pagination
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

## Dipanggil dari

Model digunakan di seluruh lapisan sebagai type annotation:

```typescript
// src/services/user.service.ts
import { PublicUser, PaginatedResult } from '@/models/user.model';

export async function getAllUsers(): Promise<PaginatedResult<PublicUser>> {
  // ...
}
```
