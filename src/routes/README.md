# src/routes/

Folder ini mendefinisikan seluruh routing aplikasi — menghubungkan URL endpoint dengan handler dan middleware yang sesuai. Routes tidak mengandung logika bisnis; tugasnya hanya memetakan request ke handler yang tepat.

## Kegunaan

- Mendefinisikan path dan HTTP method setiap endpoint
- Menghubungkan middleware spesifik (auth, validasi) ke route tertentu
- Mengorganisir endpoint berdasarkan resource/domain
- Mendaftarkan semua router ke aplikasi di `app.ts`

## Struktur yang Disarankan

```
src/routes/
├── index.ts          # Agregasi semua router, daftarkan ke app
├── user.route.ts     # Endpoint terkait user
├── auth.route.ts     # Endpoint autentikasi
└── post.route.ts     # Endpoint terkait konten
```

## Contoh Penggunaan

**`src/routes/user.route.ts`**

```typescript
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '@/handlers/user.handler';
import { authenticate } from '@/middlewares/auth.middleware';
import {
  validateBody,
  validateParams,
} from '@/middlewares/validate.middleware';
import {
  createUserSchema,
  updateUserSchema,
} from '@/validations/user.validation';
import { idParamSchema } from '@/validations/common.validation';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, validateParams(idParamSchema), getUserById);
router.post('/', authenticate, validateBody(createUserSchema), createUser);
router.put(
  '/:id',
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  updateUser
);
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteUser);

export default router;
```

**`src/routes/index.ts`**

```typescript
import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import postRouter from './post.route';

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);

export default router;
```

## Dipanggil dari

Router indeks didaftarkan sekali di `app.ts`:

```typescript
// src/app.ts
import router from '@/routes';

app.use('/api/v1', router);
```
