export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAccessJWT } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const isAuthenticated = await verifyAccessJWT(request);

  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 });
  }

  // In production, the resume would be stored in a Cloudflare R2 bucket
  // or served from a non-public location. For now, return a placeholder
  // response indicating where to place the file.
  //
  // To serve a real PDF, replace this with:
  //   const pdf = await import('../../../private-assets/resume.pdf');
  //   or fetch from R2/D1/KV
  return new Response(
    'Place your resume.pdf in src/private-assets/ and update this route to serve it.',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  );
};
