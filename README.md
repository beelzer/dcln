# dcln.me

Personal portfolio site built with Astro 5 and deployed on Cloudflare Pages.

## Stack

- **Framework**: Astro 5 (hybrid rendering)
- **Styling**: Vanilla CSS with modern features (nesting, `@layer`, `color-mix()`, scroll-driven animations)
- **Hosting**: Cloudflare Pages
- **Auth**: Cloudflare Access (Google OAuth) for private content

## Development

```sh
npm install
npm run dev
```

## Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start dev server         |
| `npm run build`    | Production build         |
| `npm run check`    | TypeScript type checking |
| `npm run lint`     | ESLint + Prettier check  |
| `npm run lint:fix` | Auto-fix lint issues     |

## Project Structure

```text
src/
  components/    UI components (Astro)
  content/       Markdown content collections
  layouts/       Base page layout
  lib/           Constants, auth utilities
  pages/         Routes (public + private SSR)
  styles/        Global CSS and design tokens
public/          Static assets, security headers
```

## Deployment

Pushes to `main` trigger automatic builds on Cloudflare Pages. CI runs lint, type check, and build in parallel via GitHub Actions.
