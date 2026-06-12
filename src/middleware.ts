import { defineMiddleware } from 'astro:middleware';
import { getAccessEmail } from './lib/auth';
import { SECURITY_HEADERS } from './lib/constants';

/** Apply security headers to a server-rendered response. */
function withSecurityHeaders(response: Response): Response {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
}

/**
 * Protect all /private/* sub-pages (resume, contact, download).
 * The /private index itself handles auth display inline.
 *
 * Also sets security headers: `public/_headers` only covers static
 * assets on Cloudflare, so SSR responses get them here instead.
 */
export const onRequest = defineMiddleware(
  async ({ request, url, redirect, isPrerendered }, next) => {
    const isProtectedSubPage = url.pathname.startsWith('/private/') && url.pathname !== '/private/';

    if (isProtectedSubPage) {
      const email = await getAccessEmail(request);
      if (!email) {
        return withSecurityHeaders(redirect('/private'));
      }
    }

    const response = await next();
    // Prerendered pages are served as static assets and get headers
    // from public/_headers; mutating them here would be discarded.
    return isPrerendered ? response : withSecurityHeaders(response);
  },
);
