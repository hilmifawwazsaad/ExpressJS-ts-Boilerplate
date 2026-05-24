---
name: software-principles
description: Software engineering principles to apply when writing, reviewing, or refactoring any code. Language-agnostic — examples use TypeScript. Required reading for all code generation.
license: MIT
---

## Pre-Code Checklist

1. One reason to change? If not — split it (SRP)
2. Simpler solution with same outcome? — use it (KISS)
3. Building for a future need that doesn't exist yet? — delete it (YAGNI)
4. Can I name this without using `and`, `data`, `info`, `manager`, or `handle`? — if not, rethink the design

## Principles

| Principle                            | Rule                                                | Violation Signal                                         | Fix                                     |
| ------------------------------------ | --------------------------------------------------- | -------------------------------------------------------- | --------------------------------------- |
| **SRP** — Single Responsibility      | One unit, one reason to change                      | `"and"` in name · file > 200 lines · function > 20 lines | Split into focused units                |
| **OCP** — Open/Closed                | Extend behavior without modifying existing code     | `if/switch` on type to add new behavior                  | Strategy pattern · polymorphism         |
| **LSP** — Liskov Substitution        | Subtypes honor parent contract fully                | Override that throws, ignores, or narrows                | Redesign hierarchy · prefer composition |
| **ISP** — Interface Segregation      | No forced dependency on unused members              | Implementing empty or stub methods                       | Split interface into smaller contracts  |
| **DIP** — Dependency Inversion       | Depend on abstractions, not concretions             | `new ConcreteService()` hardcoded inside logic           | Inject dependencies                     |
| **DRY** — Don't Repeat Yourself      | One source of truth per piece of logic              | Copy-paste logic across files                            | Extract to shared function or module    |
| **KISS** — Keep It Simple            | Simplest solution that correctly solves the problem | Unnecessary abstraction · deep indirection               | Remove layers · flatten                 |
| **YAGNI** — You Aren't Gonna Need It | Build only what is needed right now                 | Unused params · "might need later" code                  | Delete it                               |
| **SoC** — Separation of Concerns     | Each module owns exactly one concern                | Mixed HTTP + business + DB in one unit                   | Separate into layers                    |
| **LoD** — Law of Demeter             | Talk only to direct collaborators                   | `a.b.c.method()` chains                                  | Add intermediate method                 |
| **Fail Fast**                        | Surface errors at the earliest point                | Silent catch · late validation · nullable everywhere     | Validate at boundaries · throw early    |
| **Composition > Inheritance**        | Compose behaviors instead of extending classes      | Inheritance chain > 2 levels                             | Interfaces + injected dependencies      |
| **SSOT** — Single Source of Truth    | One authoritative place per logic or data           | Same validation in multiple layers                       | Centralize · import everywhere          |

## Naming

Generic names destroy readability. Names must reveal intent.

| Concept   | Pattern                     | Good                                           | Bad                                     |
| --------- | --------------------------- | ---------------------------------------------- | --------------------------------------- |
| Functions | verb phrase                 | `getUserById`, `validateEmail`, `hashPassword` | `handle`, `process`, `doStuff`, `run`   |
| Booleans  | `is` / `has` / `can` prefix | `isActive`, `hasPermission`, `canDelete`       | `active`, `flag`, `check`, `status`     |
| Variables | noun, specific              | `userId`, `paginatedUsers`, `hashedPassword`   | `data`, `result`, `info`, `temp`, `val` |
| Classes   | noun, single concept        | `UserService`, `AuthMiddleware`                | `UserManager`, `DataHandler`, `Helper`  |
| Files     | `[domain].[layer].ts`       | `user.service.ts`, `auth.middleware.ts`        | `utils2.ts`, `misc.ts`, `helpers.ts`    |

Rules: no abbreviations (except `id`, `req`, `res`, `err`, `ctx`) · no single-letter names outside loop counters · name length proportional to scope.

## Function Design

| Rule                  | Limit                   | When exceeded                                |
| --------------------- | ----------------------- | -------------------------------------------- |
| Single responsibility | One action per function | Split into smaller functions                 |
| Length                | ≤ 20 lines              | Extract inner logic to named helper          |
| Parameters            | ≤ 3 params              | Group into an options object                 |
| Nesting               | ≤ 2 levels deep         | Extract or use early return (guard clause)   |
| Return paths          | Prefer single exit      | Guard clauses at top, one `return` at bottom |

```typescript
// ✅ Guard clause — flat, readable
function getUser(id: string) {
  if (!id) throw new ValidationError('id required');
  const user = userRepo.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

// ❌ Deep nesting
function getUser(id: string) {
  if (id) {
    const user = userRepo.findById(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundError();
    }
  } else {
    throw new ValidationError();
  }
}
```

## Applied to This Project

| Principle | Concrete example                                                          |
| --------- | ------------------------------------------------------------------------- |
| SRP       | `user.service.ts` owns only user logic — email goes in `email.service.ts` |
| SoC       | Routes / handlers / services / repositories — never mix                   |
| DIP       | Services call repository functions, not Prisma directly                   |
| DRY       | Schema once in `validations/` — type via `z.infer`, not duplicated        |
| Fail Fast | `config/env.ts` throws at startup if env vars missing                     |
| SSOT      | Errors → `utils/errors.ts` · response shape → `utils/response.ts`         |
| YAGNI     | Don't add caching, pagination, or rate limiting until feature needs it    |
| KISS      | Handler calls one service function — no orchestration in handler          |

## Never Do

- Name anything `data`, `result`, `info`, `temp`, `manager`, `handleX`, `processX`
- Functions > 20 lines · parameters > 3 · nesting > 2 levels — split or group
- `as any` or `as unknown as T` to bypass type checks — fix the actual type issue
