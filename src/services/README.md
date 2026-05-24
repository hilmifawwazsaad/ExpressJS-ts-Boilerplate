# src/services/

Folder ini menyimpan logika bisnis aplikasi — memisahkan handler dari detail implementasi seperti akses database, pemanggilan API eksternal, dan operasi domain-specific.

## Kegunaan

- Menampung logika bisnis utama dan aturan domain
- Memanggil repositories untuk akses data
- Mengorkestrasikan operasi yang melibatkan beberapa repository atau service
- Membuat handler tetap tipis — handler hanya menerima input dan meneruskan ke service
- Berbeda dengan `utils/` yang berisi helper umum, services/ berisi logika spesifik domain aplikasi

## Struktur yang Disarankan

```
src/services/
├── user.service.ts     # Operasi terkait user (getUser, createUser, dsb.)
├── auth.service.ts     # Logika autentikasi (login, register, token)
└── post.service.ts     # Operasi terkait konten/postingan
```

## Contoh Penggunaan

**`src/services/user.service.ts`**

```typescript
import * as userRepo from '@/repositories/user.repository';
import {
  CreateUserInput,
  UpdateUserInput,
} from '@/validations/user.validation';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { hashPassword } from '@/utils/hash';

export async function getUserById(id: string) {
  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError('User tidak ditemukan');
  return user;
}

export async function getAllUsers({ page = 1, limit = 10 } = {}) {
  const [items, totalItems] = await Promise.all([
    userRepo.findMany({ page, limit }),
    userRepo.count(),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function createUser(data: CreateUserInput) {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new ConflictError('Email sudah digunakan');

  const hashedPassword = await hashPassword(data.password);
  return userRepo.create({ ...data, password: hashedPassword });
}

export async function updateUser(id: string, data: UpdateUserInput) {
  await getUserById(id); // Pastikan user ada
  return userRepo.update(id, data);
}

export async function deleteUser(id: string) {
  await getUserById(id); // Pastikan user ada
  return userRepo.remove(id);
}
```

## Dipanggil dari

Service dipanggil oleh handler:

```typescript
// src/handlers/user.handler.ts
import * as userService from '@/services/user.service';

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await userService.getAllUsers({ page: 1, limit: 10 });
    res.json({ success: true, data: result, message: 'OK', error: null });
  } catch (err) {
    next(err);
  }
}
```
