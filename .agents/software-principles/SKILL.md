---
name: software-principles
description: Engineering principles for all code in this Express.js TypeScript project. Required reading before any code generation.
license: MIT
---

## Pre-Code Checklist

1. One reason to change? If not — split it (SRP)
2. Simpler solution with same outcome? — use it (KISS)
3. Building for a future need that doesn't exist yet? — delete it (YAGNI)
4. Name reveals intent without generic words? (`and`, `data`, `info`, `manager`, `handle`) — if not, rethink

## Principles

| Principle                            | Rule                                    | Signal                                           | Fix                                  |
| ------------------------------------ | --------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| **SRP** — Single Responsibility      | One unit, one reason to change          | `and` in name · file > 200 lines · fn > 20 lines | Split                                |
| **OCP** — Open/Closed                | Extend without modifying existing code  | Adding a variant by editing internals            | New module/strategy                  |
| **DIP** — Dependency Inversion       | Depend on abstractions, not concretions | `new ConcreteService()` hardcoded in logic       | Inject dependencies                  |
| **DRY** — Don't Repeat Yourself      | One source of truth per piece of logic  | Copy-paste logic across files                    | Extract to shared module             |
| **KISS** — Keep It Simple            | Simplest correct solution               | Unnecessary abstraction · deep indirection       | Remove layers · flatten              |
| **YAGNI** — You Aren't Gonna Need It | Build only what is needed now           | Unused params · "might need later" code          | Delete it                            |
| **SoC** — Separation of Concerns     | Each module owns one concern            | Business logic mixed with request handling       | Separate into layers                 |
| **LoD** — Law of Demeter             | Talk only to direct collaborators       | `a.b.c.method()` chains                          | Add intermediate method              |
| **Fail Fast**                        | Surface errors at earliest point        | Silent catch · late validation                   | Validate at boundaries · throw early |
| **SSOT** — Single Source of Truth    | One authoritative place per logic       | Same validation in multiple layers               | Centralize · import everywhere       |

## Naming

Generic names destroy readability. Names must reveal intent.

| Concept   | Pattern                     | Good                                           | Bad                                   |
| --------- | --------------------------- | ---------------------------------------------- | ------------------------------------- |
| Functions | verb phrase                 | `getUserById`, `validateEmail`, `hashPassword` | `handle`, `process`, `doStuff`, `run` |
| Booleans  | `is` / `has` / `can` prefix | `isActive`, `hasPermission`, `canDelete`       | `active`, `flag`, `check`, `status`   |
| Variables | noun, specific              | `userId`, `paginatedUsers`, `hashedPassword`   | `data`, `result`, `info`, `temp`      |
| Files     | `[domain].[layer].ts`       | `user.service.ts`, `auth.middleware.ts`        | `utils2.ts`, `misc.ts`, `helpers.ts`  |

Rules: no abbreviations (except `id`, `req`, `res`, `err`, `ctx`) · no single-letter names outside loop counters.

## Function Design

| Rule                  | Limit              | When exceeded                                |
| --------------------- | ------------------ | -------------------------------------------- |
| Single responsibility | One action         | Split into smaller functions                 |
| Length                | ≤ 20 lines         | Extract to named helper                      |
| Parameters            | ≤ 3                | Group into options object                    |
| Nesting               | ≤ 2 levels         | Early return (guard clause)                  |
| Return paths          | Prefer single exit | Guard clauses at top, one `return` at bottom |

## Applied to This Project

Express.js TypeScript — layered architecture (`routes → handlers → services → repositories`).

| Principle | Example                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------- |
| SRP       | `UserService` owns one domain — no mixing auth logic into user service                          |
| SoC       | Handlers receive/respond · services own logic · repositories own DB — never mix                 |
| DRY       | Shared types in `types/` · validation schema once in `validations/` via `z.infer`               |
| Fail Fast | `config/env.ts` throws at startup if env vars missing · validate `req.body` at handler boundary |
| SSOT      | Error classes → `utils/errors.ts` · env vars → `config/env.ts`                                  |
| YAGNI     | No abstraction until needed by 2+ consumers                                                     |
| KISS      | Handler calls one service method — no orchestration logic in handlers                           |
| DIP       | Services depend on repository interfaces, not concrete implementations                          |

## Async Error Handling

- Catch only where you can meaningfully recover
- Never `catch` and return `null`/`undefined` — throw a typed error instead
- Always propagate to Express error middleware via `next(err)`

## Testing

- Unit test pure functions and services in isolation
- Integration test at route boundaries — not implementation details
- Don't mock what you own; mock external services only
- One assertion per test concept

## Never Do

- Name anything `data`, `result`, `info`, `temp`, `manager`, `handleX`, `processX`
- Functions > 20 lines · parameters > 3 · nesting > 2 levels — split or group
- `as any` or `as unknown as T` to bypass type checks — fix the actual type
- Put business logic in handlers or routes — extract to service
