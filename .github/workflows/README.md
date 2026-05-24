# Workflows

GitHub Actions workflows for CI/CD pipeline.

## ci.yml — Continuous Integration

Triggered on every `push` and `pull_request` to `main`.

| Step             | Command             | Description                   |
| ---------------- | ------------------- | ----------------------------- |
| Check formatting | `pnpm format:check` | Prettier check                |
| Run lint         | `pnpm lint:strict`  | ESLint strict (zero warnings) |
| Type check       | `pnpm typecheck`    | TypeScript check without emit |
| Build            | `pnpm build`        | Compile TypeScript to `dist/` |

## cd.yml — Continuous Deployment

Triggered after CI workflow completes successfully on `main`.

Three deploy options are available (uncomment the one you need):

| Option            | Secrets Required                                     |
| ----------------- | ---------------------------------------------------- |
| Vercel            | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| VPS via SSH       | `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`            |
| Docker + Registry | `DOCKER_USERNAME`, `DOCKER_PASSWORD`                 |

To add secrets: **GitHub repo → Settings → Secrets and variables → Actions**.
