export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Auth is handled by middleware for all /private/* routes.
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
