# src/repositories/

Folder ini adalah satu-satunya lapisan yang boleh berinteraksi langsung dengan database. Repository mengabstraksi query database sehingga service tidak perlu tahu detail implementasi penyimpanan data.

## Kegunaan

- Menyimpan semua query database (Prisma, TypeORM, raw SQL, dsb.)
- Mengabstraksi detail ORM/database dari layer service
- Memudahkan pergantian database atau ORM di masa depan cukup dengan mengubah repository
- Membuat service dan handler tetap bersih dari kode database

## Prinsip

- Repository **tidak** mengandung logika bisnis
- Repository hanya menerima parameter primitif atau data sederhana, bukan business object
- Satu repository per entitas/model data

## Struktur yang Disarankan

```
src/repositories/
├── user.repository.ts      # Query database terkait user
├── auth.repository.ts      # Query terkait session/token
└── post.repository.ts      # Query terkait konten
```

## Contoh Penggunaan

**`src/repositories/user.repository.ts`**

```typescript
import { prisma } from '@/config/database';
import { Prisma } from '@prisma/client';

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findMany({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}) {
  return prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function count() {
  return prisma.user.count();
}

export async function create(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data });
}

export async function update(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.user.delete({ where: { id } });
}
```

## Dipanggil dari

Repository hanya dipanggil dari service, tidak dari handler atau middleware:

```typescript
// src/services/user.service.ts
import * as userRepo from '@/repositories/user.repository';

const user = await userRepo.findById(id);
const existing = await userRepo.findByEmail(data.email);
```
