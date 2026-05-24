# src/utils/

Folder ini menyimpan fungsi-fungsi helper dan utilitas umum yang dapat digunakan di seluruh lapisan aplikasi — tidak spesifik ke domain bisnis tertentu.

## Kegunaan

- Menyimpan fungsi helper yang dipakai ulang di banyak tempat
- Mendefinisikan class error custom untuk error handling yang konsisten
- Mengelola fungsi formatting, transformasi data, dan operasi umum lainnya
- Berbeda dengan `services/` yang berisi logika bisnis, `utils/` berisi fungsi teknis yang domain-agnostic

## Struktur yang Disarankan

```
src/utils/
├── errors.ts           # Custom error classes
├── hash.ts             # Fungsi hashing (password, dsb.)
├── jwt.ts              # Helper JWT (sign, verify)
├── paginate.ts         # Helper kalkulasi pagination
└── response.ts         # Helper format respons API
```

## Contoh Penggunaan

**`src/utils/errors.ts`**

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource tidak ditemukan') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Tidak terautentikasi') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Tidak memiliki akses') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Data sudah ada') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('Data tidak valid', 422, details);
  }
}
```

**`src/utils/response.ts`**

```typescript
import { Response } from 'express';
import { ApiResponse } from '@/types/api.types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null,
  } satisfies ApiResponse<T>);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Berhasil dibuat'
) {
  return sendSuccess(res, data, message, 201);
}
```

**`src/utils/hash.ts`**

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

## Dipanggil dari

Utils dapat digunakan di seluruh layer — services, handlers, dan middlewares:

```typescript
// src/services/user.service.ts
import { hashPassword } from '@/utils/hash';
import { NotFoundError, ConflictError } from '@/utils/errors';

// src/handlers/user.handler.ts
import { sendSuccess, sendCreated } from '@/utils/response';
```
