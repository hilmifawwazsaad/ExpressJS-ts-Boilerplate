---
name: backend
description: Generate production-grade Express.js + TypeScript code with Layered Architecture. Routes, handlers, services, repositories, middlewares, validations, utils — no UI.
license: MIT
---

## Pre-Code Checklist

1. Which layer? Map need to exactly one row in the Architecture table
2. Call direction: `routes → handlers → services → repositories` — no skipping, no reversing
3. Error to throw? Use typed class from `utils/errors.ts`, never raw `new Error()`

## Architecture

| Layer                              | File                                   | Constraint                                               |
| ---------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| Path + HTTP method                 | `routes/[name].route.ts`               | Attach middleware + handler only — no logic              |
| Auth, rate limiting                | `middlewares/[name].middleware.ts`     | Always call `next()` or `next(err)`                      |
| Body / params / query validation   | `validations/[name].validation.ts`     | Zod schema · export `z.infer` as named type              |
| Request → response                 | `handlers/[name].handler.ts`           | < 20 lines · `try/catch/next(err)` · no DB               |
| Business logic                     | `services/[name].service.ts`           | No `req`/`res` · throw on not-found, never return `null` |
| DB queries                         | `repositories/[name].repository.ts`    | Only layer allowed to touch DB                           |
| Entity interfaces and enums        | `models/[name].model.ts`               | Domain types only                                        |
| Env vars, DB connection            | `config/env.ts` · `config/database.ts` | All `process.env` here only                              |
| Helpers, errors, response format   | `utils/`                               | Domain-agnostic — no layer imports                       |
| Express + shared type augmentation | `types/express.d.ts`                   | `req.user` augmentation here only                        |

## TypeScript

- `strict: true` enforced in `tsconfig.json`
- `unknown` not `any` — if `any` is necessary, add an inline comment
- Unused params: prefix with `_` — `_req`, `_res`, `_next`
- Types from Zod only: `type T = z.infer<typeof schema>` — never write duplicate interfaces
- All `src/` imports via `@/` alias — never relative `../../`

## Response & Errors

`sendSuccess(res, data)` · `sendCreated(res, data, msg)` from `utils/response.ts`. For errors: `next(err)`.

Errors from `utils/errors.ts` only — never `throw new Error()`:
`NotFoundError` · `UnauthorizedError` · `ForbiddenError` · `ConflictError` · `ValidationError`

## Never Do

- Logic in `routes/` · DB in `handlers/` · `req`/`res` in `services/`
- `process.env` outside `config/env.ts`
- Return `null` for missing data — throw `NotFoundError`
- `any` without inline comment · manual types duplicating a Zod schema
- Expose raw `err.message` or stack trace to client
- Log secrets, tokens, or passwords
- Import libraries not in `package.json`
