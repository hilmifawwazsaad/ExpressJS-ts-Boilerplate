# AGENTS.md

Before writing any code:

1. Read `.agents/software-principles/SKILL.md` — **mandatory for every task**
2. Read the domain skill file from the table below
3. Check `package.json` — never import libraries that aren't installed

**Stack:** Express.js 5 · Node.js · TypeScript 6 (strict) · pnpm · ts-node · nodemon · ESLint 10 · Prettier · Husky · commitlint — no ORM or auth library installed by default.

| Task domain | When to use                                                                    | Skill file                 |
| ----------- | ------------------------------------------------------------------------------ | -------------------------- |
| Backend     | Any server-side code — Express routes, business logic, data access, middleware | `.agents/backend/SKILL.md` |

Convention missing from skill file → ask before inventing.
