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

## Don'ts

- Don't add `transition:name` to elements — causes performance issues
- Don't add CSS preprocessors or utility frameworks (Tailwind, etc.)
- Don't add client-side JS unless absolutely necessary
- Don't hardcode strings/numbers — use constants.ts or CSS custom properties
