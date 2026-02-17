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
- `Co-Authored-By` goes on the **last commit only** (squash merge concatenates all messages — avoid duplicates)
- One blank line before `Co-Authored-By`
- **One logical change per commit** — never bundle unrelated changes
- When asked to "commit and push", review staged changes and split into separate commits if they cover different concerns (e.g. a bug fix + a new feature = 2 commits)

Examples:

- `feat: add project filtering by tech stack`
- `fix: resolve navigation flash on back button`
- `refactor: extract shared layout into base component`
- `style: format config files with prettier`
- `docs: add deployment instructions to readme`
- `chore: update dependencies`
- `ci: add parallel lint and typecheck jobs`
- `perf: lazy load project card images`

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

**After committing all changes and before pushing the branch**, automatically determine the version bump:

- **patch** (0.1.0 → 0.1.1) — `fix`, `style`, `perf`, `chore` (dependency updates)
- **minor** (0.1.0 → 0.2.0) — `feat` (new features, new pages, new components)
- **major** (0.2.0 → 1.0.0) — breaking changes, major redesigns (rare, confirm with user first)
- **no bump** — `ci`, `docs`, `refactor`-only changes, CLAUDE.md-only changes

Use the highest applicable bump across all commits in the push. Then:

1. Run `npm version patch/minor --no-git-tag-version`
2. Commit with message `chore: bump version to X.Y.Z`
3. Push the branch and open a PR

## Git Workflow

Branch protection is active on `main` — direct pushes are blocked.

When asked to "commit and push" or when changes need to go to the repo:

1. Create a feature branch from `main` (e.g. `feat/add-filtering`, `fix/nav-flash`)
2. Make commits on that branch (split by logical change as usual)
3. Apply the version bump commit if applicable (see Versioning above)
4. Push the branch and open a PR via `gh pr create`
5. CI (Build) must pass before merging
6. User merges the PR on GitHub

Branch naming: `<type>/<short-description>` matching the primary commit type.

## Pull Requests

- PR body should contain only a `## Summary` section with 1–3 bullet points
- Do **not** include a test plan section — CI handles that
- Do **not** include a "Generated with Claude Code" footer or any AI attribution line

## Don'ts

- Don't add `transition:name` to elements — causes performance issues
- Don't add CSS preprocessors or utility frameworks (Tailwind, etc.)
- Don't add client-side JS unless absolutely necessary
- Don't hardcode strings/numbers — use constants.ts or CSS custom properties
