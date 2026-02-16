declare const __COMMIT_HASH__: string;
declare const __VERSION__: string;

export const SITE = {
  name: 'dcln.me',
  title: 'dcln.me — Declan',
  description: 'Portfolio & projects by Declan',
  author: 'Declan',
  email: 'contact@dcln.me',
  github: 'https://github.com/beelzer',
  cfAccessTeamDomain: 'https://dcln-me.cloudflareaccess.com',
  featuredProjectsLimit: 3,
  version: __VERSION__,
  commitHash: __COMMIT_HASH__,
} as const;

/** How long to cache Cloudflare Access public keys (1 hour). */
export const JWKS_CACHE_DURATION_MS = 60 * 60 * 1000;

/** Clock skew tolerance for JWT not-before claim (seconds). */
export const JWT_NBF_TOLERANCE_S = 60;
