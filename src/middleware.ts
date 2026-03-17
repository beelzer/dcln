import { defineMiddleware } from 'astro:middleware';
import { getAccessEmail } from './lib/auth';

/**
 * Protect all /private/* sub-pages (resume, contact, download).
 * The /private index itself handles auth display inline.
 */
export const onRequest = defineMiddleware(async ({ request, url, redirect }, next) => {
  const isProtectedSubPage = url.pathname.startsWith('/private/') && url.pathname !== '/private/';

  if (isProtectedSubPage) {
    const email = await getAccessEmail(request);
    if (!email) {
      return redirect('/private');
    }
  }

  return next();
});
