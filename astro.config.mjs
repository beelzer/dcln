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
  adapter: cloudflare(),
  integrations: [sitemap()],
  vite: {
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __VERSION__: JSON.stringify(version),
    },
  },
});
