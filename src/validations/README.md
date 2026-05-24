# src/validations/

Folder ini menyimpan schema validasi untuk setiap request — memastikan data yang masuk ke handler sudah bersih, bertipe benar, dan sesuai aturan bisnis sebelum diproses lebih lanjut.

## Kegunaan

- Mendefinisikan schema validasi body, params, dan query menggunakan Zod (atau Joi)
- Menjadi satu-satunya tempat aturan validasi didefinisikan — tidak tersebar di handler atau service
- Menghasilkan TypeScript types secara otomatis dari schema (dengan Zod `z.infer`)
- Memberikan pesan error yang jelas dan konsisten ke client

## Struktur yang Disarankan

```
src/validations/
├── common.validation.ts      # Schema umum (id param, pagination query, dsb.)
├── user.validation.ts        # Schema terkait user
├── auth.validation.ts        # Schema login, register
└── post.validation.ts        # Schema terkait konten
```

## Contoh Penggunaan

**`src/validations/user.validation.ts`**

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['user', 'admin']).default('user'),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true });

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Gunakan z.infer untuk dapat TypeScript type gratis
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

**`src/validations/common.validation.ts`**

```typescript
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().cuid('ID tidak valid'),
});
```

## Dipanggil dari

Schema digunakan oleh `validate.middleware.ts` dan di-attach ke route:

```typescript
// src/routes/user.route.ts
import {
  createUserSchema,
  updateUserSchema,
} from '@/validations/user.validation';
import { validateBody } from '@/middlewares/validate.middleware';

router.post('/', validateBody(createUserSchema), createUser);
router.put('/:id', validateBody(updateUserSchema), updateUser);
```

Type yang di-infer juga dapat digunakan di handler dan service:

```typescript
// src/handlers/user.handler.ts
import { CreateUserInput } from '@/validations/user.validation';

export async function createUser(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const user = await userService.createUser(req.body);
  // ...
}
```
