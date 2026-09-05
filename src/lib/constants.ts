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
  cfAccessAud: '573c448a3696f9d7cb54ca0fedfd53a1d7848e2883fa6d69b0df4447aecd6c65',
  featuredProjectsLimit: 3,
  version: __VERSION__,
  commitHash: __COMMIT_HASH__,
} as const;

/**
 * Security headers for server-rendered responses.
 *
 * Cloudflare only applies `public/_headers` to static assets, so SSR
 * routes (the /private area) must set these themselves via middleware.
 * Keep in sync with `public/_headers`. The Content-Security-Policy is
 * emitted per page by Astro (see `security.csp` in astro.config.mjs);
 * middleware appends CSP_FRAME_ANCESTORS to it because <meta> can't
 * express that directive on prerendered pages.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'unsafe-none',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/** Appended to Astro's per-response CSP header on SSR routes. */
export const CSP_FRAME_ANCESTORS = "frame-ancestors 'none'";

/** How long to cache Cloudflare Access public keys (1 hour). */
export const JWKS_CACHE_DURATION_MS = 60 * 60 * 1000;

/** Clock skew tolerance for JWT not-before claim (seconds). */
export const JWT_NBF_TOLERANCE_S = 60;
