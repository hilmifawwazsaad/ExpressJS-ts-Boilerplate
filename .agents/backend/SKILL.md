---
name: backend
description: Generate production-grade Express.js + TypeScript code with Layered Architecture. Routes, handlers, services, repositories, middlewares, validations, utils — no UI.
license: MIT
---

## Pre-Code Checklist

1. Which layer? Map need to exactly one row in the Architecture table below
2. Call direction: `routes → handlers → services → repositories` — no skipping, no reversing
3. Error to throw? Use typed class from `utils/errors.ts`, never raw `new Error()`

## Architecture

| Need                               | File                                   | Constraint                                               |
| ---------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| Path + HTTP method definition      | `routes/[name].route.ts`               | Attach middleware + handler only — no logic              |
| Auth, rate limiting, request gate  | `middlewares/[name].middleware.ts`     | Always call `next()` or `next(err)`                      |
| Body / params / query validation   | `validations/[name].validation.ts`     | Zod schema · export `z.infer` as named type              |
| Receive request → send response    | `handlers/[name].handler.ts`           | < 20 lines · `try/catch/next(err)` · no DB               |
| Business logic, domain rules       | `services/[name].service.ts`           | No `req`/`res` · throw on not-found, never return `null` |
| Database queries                   | `repositories/[name].repository.ts`    | Only layer allowed to touch DB                           |
| Entity interfaces and enums        | `models/[name].model.ts`               | Domain types only                                        |
| Env vars, DB connection            | `config/env.ts` · `config/database.ts` | All `process.env` here only                              |
| Helpers, errors, response format   | `utils/`                               | Domain-agnostic — no layer imports                       |
| Express + shared type augmentation | `types/express.d.ts`                   | `req.user` augmentation here only                        |

## TypeScript

- `strict: true` — enforced in `tsconfig.json`
- `unknown` not `any` — if `any` is necessary, add an inline comment explaining why
- Unused params: prefix with `_` — `_req`, `_res`, `_next`
- Types from Zod only: `type T = z.infer<typeof schema>` — never write duplicate interfaces
- All `src/` imports via `@/` alias — never relative `../../`

## Response

`sendSuccess(res, data)` · `sendCreated(res, data, msg)` from `utils/response.ts`. For errors: `next(err)`.

Shape always: `{ success: boolean, data: T | null, message: string, error: unknown }`.

## Errors

From `utils/errors.ts` — never `throw new Error()` raw:

| Class               | Status |
| ------------------- | ------ |
| `NotFoundError`     | 404    |
| `UnauthorizedError` | 401    |
| `ForbiddenError`    | 403    |
| `ConflictError`     | 409    |
| `ValidationError`   | 422    |

## Security

| Rule                                                    | Why                                          |
| ------------------------------------------------------- | -------------------------------------------- |
| Never trust `req.body` — validate with Zod before use   | Prevents injection and type confusion        |
| Never expose raw `err.message` or stack trace to client | Leaks internals — use typed error classes    |
| Never log secrets, tokens, or passwords                 | Log the event, not the value                 |
| `as any` or `as unknown as T` forbidden                 | Hides real type errors — fix the actual type |

## Never Do

- Logic in `routes/` · DB access in `handlers/` · `req`/`res` in `services/`
- DB queries outside `repositories/`
- `process.env` outside `config/env.ts`
- `throw new Error()` — use typed error classes
- Return `null` for missing data — throw `NotFoundError`
- `any` without inline comment · manual types that duplicate a Zod schema
- Libraries not listed in `package.json`
