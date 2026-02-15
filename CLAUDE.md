# Claude Code Instructions

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short summary>
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `ci`, `perf`

Rules:

- Lowercase everything, no period at the end
- Summary under 70 characters
- Use imperative mood ("add feature" not "added feature")
- One blank line before `Co-Authored-By`
- **One logical change per commit** — never bundle unrelated changes
- When asked to "commit and push", review staged changes and split into separate commits if they cover different concerns (e.g. a bug fix + a new feature = 2 commits)

Examples:

- `feat: add project filtering by tech stack`
- `fix: resolve navigation flash on back button`
- `chore: update dependencies`
- `ci: add parallel lint and typecheck jobs`

## Project

- Astro 5 portfolio site deployed on Cloudflare Pages
- Vanilla CSS only (no preprocessors, no CSS-in-JS)
- Minimize JavaScript — prefer Astro's zero-JS-by-default approach
- All site-wide constants live in `src/lib/constants.ts`
- CSS design tokens in `src/styles/global.css` `:root`

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — eslint + prettier check
- `npm run check` — astro type checking

## Architecture

- Pages in `src/pages/` — public pages are prerendered, `private/*` are SSR
- Project content uses Astro Content Collections in `src/content/projects/`
- Auth handled by Cloudflare Access (JWT verification in `src/lib/auth.ts`)
- `public/_headers` controls Cloudflare security headers

## Versioning (AUTOMATIC — do this on every commit and push)

Version lives in `package.json` (single source of truth, injected at build time).

**After committing all changes and before pushing**, automatically determine the version bump:

- **patch** (0.1.0 → 0.1.1) — `fix`, `style`, `perf`, `chore` (dependency updates)
- **minor** (0.1.0 → 0.2.0) — `feat` (new features, new pages, new components)
- **major** (0.2.0 → 1.0.0) — breaking changes, major redesigns (rare, confirm with user first)
- **no bump** — `ci`, `docs`, `refactor`-only changes, CLAUDE.md-only changes

Use the highest applicable bump across all commits in the push. Then:

1. Run `npm version patch/minor --no-git-tag-version`
2. Commit with message `chore: bump version to X.Y.Z`
3. Push all commits together

## Don'ts

- Don't add `transition:name` to elements — causes performance issues
- Don't add CSS preprocessors or utility frameworks (Tailwind, etc.)
- Don't add client-side JS unless absolutely necessary
- Don't hardcode strings/numbers — use constants.ts or CSS custom properties
