import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync } from 'node:fs';
import { SITE, THEME } from '../../lib/constants';

// The site itself uses system fonts; Inter is only a build-time dependency
// here because satori needs font data (WOFF, not WOFF2) to render text.
const fontDir = 'node_modules/@fontsource/inter/files';
const interRegular = readFileSync(`${fontDir}/inter-latin-400-normal.woff`);
const interSemiBold = readFileSync(`${fontDir}/inter-latin-600-normal.woff`);

await initWasm(readFileSync('node_modules/@resvg/resvg-wasm/index_bg.wasm'));

interface OGPage {
  title: string;
  description: string;
}

const projects = await getCollection('projects');

const pages: Record<string, OGPage> = {
  index: { title: SITE.name, description: SITE.description },
  about: { title: `About — ${SITE.name}`, description: 'About this site' },
  projects: { title: `Projects — ${SITE.name}`, description: 'Projects and experiments' },
  ...Object.fromEntries(
    projects.map((project) => [
      `projects/${project.id}`,
      { title: project.data.title, description: project.data.description },
    ]),
  ),
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(pages).map((route) => ({ params: { route } }));

export const GET: APIRoute = async ({ params }) => {
  const page = pages[params.route!];
  if (!page) return new Response('Not found', { status: 404 });

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: 1200,
          height: 630,
          padding: 64,
          background: THEME.bg,
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 56,
                fontWeight: 600,
                color: THEME.text,
                lineHeight: 1.15,
                marginBottom: 16,
              },
              children: page.title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 26, color: THEME.textMuted, lineHeight: 1.4 },
              children: page.description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 20,
                fontWeight: 600,
                color: THEME.accent,
                marginTop: 'auto',
                paddingTop: 40,
              },
              children: SITE.name,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' as const },
        { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' as const },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png.buffer as ArrayBuffer, { headers: { 'Content-Type': 'image/png' } });
};
