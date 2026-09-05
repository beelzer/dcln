// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  site: 'https://dcln.me',
  // OG images read font files and WASM from node_modules at build time,
  // which needs Node rather than workerd.
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
  integrations: [sitemap()],
  security: {
    // Astro emits a <meta http-equiv="content-security-policy"> per page with
    // SHA-256 hashes for the inline scripts it generates, so no 'unsafe-inline'
    // is needed for script-src. frame-ancestors can't be set via <meta>, so it
    // stays in public/_headers and SECURITY_HEADERS for SSR responses.
    csp: {
      directives: [
        "default-src 'none'",
        "img-src 'self' data: github.com *.githubusercontent.com img.shields.io",
        "font-src 'self'",
        "connect-src 'self' cloudflareinsights.com",
        "form-action 'self'",
        "base-uri 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", 'static.cloudflareinsights.com'] },
      // Shiki-highlighted READMEs use inline style attributes, which can't be hashed.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  vite: {
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __VERSION__: JSON.stringify(version),
    },
  },
});
