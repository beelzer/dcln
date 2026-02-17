# Contributing

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated locally via a husky `commit-msg` hook and in CI via commitlint.

Format:

```
<type>: <short summary>
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `ci`, `perf`

Rules:

- Lowercase everything, no period at the end
- Summary under 70 characters
- Use imperative mood ("add feature" not "added feature")

Examples:

- `feat: add project filtering by tech stack`
- `fix: resolve navigation flash on back button`
- `chore: update dependencies`

## Branch Workflow

1. Create a branch from `main` (e.g. `feat/add-filtering`, `fix/nav-flash`)
2. Make commits following the convention above
3. Push and open a PR — CI will run lint, type check, unit tests, build, and E2E tests
4. Squash merge after CI passes

## Development

```sh
npm install
npm run dev
```

## Testing

```sh
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Playwright E2E tests (requires a build first)
npm run build        # Build before running E2E
```
