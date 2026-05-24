# src/handlers/

Folder ini menyimpan route handlers (controller) — lapisan tipis yang menjadi jembatan antara HTTP request dan logika bisnis. Handler tidak boleh mengandung logika bisnis atau query database secara langsung.

## Kegunaan

- Menerima request yang sudah tervalidasi dari middleware
- Mengekstrak data dari `req.body`, `req.params`, dan `req.query`
- Memanggil service yang sesuai
- Memformat dan mengirim respons HTTP ke client
- Menangkap error dan meneruskannya ke error middleware

## Prinsip

Handler harus **tipis** — jika handler lebih dari ~20 baris, kemungkinan ada logika yang seharusnya dipindah ke service.

## Struktur yang Disarankan

```
src/handlers/
├── user.handler.ts     # Handler endpoint user
├── auth.handler.ts     # Handler endpoint autentikasi
└── post.handler.ts     # Handler endpoint konten
```

## Contoh Penggunaan

**`src/handlers/user.handler.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import {
  CreateUserInput,
  UpdateUserInput,
} from '@/validations/user.validation';

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = req.query;
    const result = await userService.getAllUsers({
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
    });
    res.json({ success: true, data: result, message: 'OK', error: null });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user, message: 'OK', error: null });
  } catch (err) {
    next(err);
  }
}

export async function createUser(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: 'User berhasil dibuat',
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request<{ id: string }, {}, UpdateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      data: user,
      message: 'User berhasil diperbarui',
      error: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'User berhasil dihapus',
      error: null,
    });
  } catch (err) {
    next(err);
  }
}
```

## Dipanggil dari

Handler dipanggil oleh routes:

```typescript
// src/routes/user.route.ts
import { getUsers, createUser } from '@/handlers/user.handler';

router.get('/', authenticate, getUsers);
router.post('/', authenticate, validateBody(createUserSchema), createUser);
```
