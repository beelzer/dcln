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
  /**
   * Application Audience (AUD) tag from Cloudflare Zero Trust →
   * Access → Applications → <app> → Overview. When set, JWTs must
   * carry this audience; when empty, the check is skipped.
   */
  cfAccessAud: '',
  featuredProjectsLimit: 3,
  version: __VERSION__,
  commitHash: __COMMIT_HASH__,
} as const;

/**
 * Security headers for server-rendered responses.
 *
 * Cloudflare only applies `public/_headers` to static assets, so SSR
 * routes (the /private area) must set these themselves via middleware.
 * Keep in sync with `public/_headers` — the one intentional difference
 * is `img-src https:`, because Access identity-provider avatars can be
 * served from any IdP domain.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'none'; script-src 'self' static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' cloudflareinsights.com; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'unsafe-none',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/** How long to cache Cloudflare Access public keys (1 hour). */
export const JWKS_CACHE_DURATION_MS = 60 * 60 * 1000;

/** Clock skew tolerance for JWT not-before claim (seconds). */
export const JWT_NBF_TOLERANCE_S = 60;
