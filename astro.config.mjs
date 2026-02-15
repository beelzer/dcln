// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { execSync } from 'node:child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  site: 'https://dcln.me',
  adapter: cloudflare(),
  vite: {
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
    },
  },
});
