# dcln.me

![CI](https://github.com/beelzer/dcln/actions/workflows/ci.yml/badge.svg)
![Astro](https://img.shields.io/badge/Astro-6-bc52ee?logo=astro&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-deployed-f38020?logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

Personal portfolio site built with Astro 6 and deployed on Cloudflare Workers.

## Stack

- **Framework**: Astro 6 (hybrid rendering)
- **Styling**: Vanilla CSS with modern features (nesting, `@layer`, `color-mix()`, scroll-driven animations)
- **Hosting**: Cloudflare Workers
- **Auth**: Cloudflare Access (Google OAuth) for private content

## Development

```sh
npm install
npm run dev
```

## Commands

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start dev server         |
| `npm run build`     | Production build         |
| `npm run check`     | TypeScript type checking |
| `npm run lint`      | ESLint + Prettier check  |
| `npm run lint:fix`  | Auto-fix lint issues     |
| `npm run test:unit` | Run Vitest unit tests    |
| `npm run test:e2e`  | Run Playwright E2E tests |

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

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for commit conventions and workflow.

## Deployment

Pushes to `main` trigger automatic builds on Cloudflare Workers. CI runs lint, type check, unit tests, build, and E2E tests via GitHub Actions.
