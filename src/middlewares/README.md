# src/middlewares/

Folder ini menyimpan semua Express middleware — fungsi yang dieksekusi di antara request masuk dan handler. Middleware menangani aspek cross-cutting seperti autentikasi, validasi, logging, dan error handling.

## Kegunaan

- **Autentikasi & Otorisasi**: Verifikasi token JWT, cek role/permission
- **Validasi**: Validasi request body, params, dan query sebelum sampai ke handler
- **Error Handling**: Tangkap dan format semua error secara konsisten
- **Logging**: Catat setiap request yang masuk
- **Rate Limiting**: Batasi jumlah request per client

## Struktur yang Disarankan

```
src/middlewares/
├── auth.middleware.ts        # Verifikasi JWT, inject user ke request
├── validate.middleware.ts    # Wrapper validasi Zod/Joi schema
├── error.middleware.ts       # Global error handler
├── notFound.middleware.ts    # Handler 404
└── rateLimit.middleware.ts   # Rate limiting
```

## Contoh Penggunaan

**`src/middlewares/auth.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { UnauthorizedError } from '@/utils/errors';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError('Token tidak ditemukan');

  const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
  req.user = { id: payload.userId };
  next();
}
```

**`src/middlewares/validate.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@/utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) throw new ValidationError(result.error.flatten());
    req.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) throw new ValidationError(result.error.flatten());
    next();
  };
}
```

**`src/middlewares/error.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      error: err.details ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    data: null,
    message: 'Internal Server Error',
    error: null,
  });
}
```

## Dipanggil dari

Middleware global didaftarkan di `app.ts`, middleware spesifik didaftarkan di `routes/`:

```typescript
// src/app.ts — global
app.use(errorHandler);
app.use(notFoundHandler);

// src/routes/user.route.ts — spesifik
router.get('/', authenticate, getUsers);
router.post('/', authenticate, validateBody(createUserSchema), createUser);
```
