import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync } from 'node:fs';
import { SITE } from '../../lib/constants';

const interRegular = readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
);
const interSemiBold = readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff',
);

await initWasm(readFileSync('node_modules/@resvg/resvg-wasm/index_bg.wasm'));

interface OGPage {
  title: string;
  description: string;
}

const projects = await getCollection('projects');

const pages: Record<string, OGPage> = {
  index: { title: SITE.name, description: SITE.description },
  about: { title: `About — ${SITE.name}`, description: `About ${SITE.author}` },
  projects: {
    title: `Projects — ${SITE.name}`,
    description: 'A collection of projects and experiments',
  },
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
          background: '#0a0a0a',
          padding: 60,
          borderLeft: '6px solid #3b82f6',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 56,
                fontWeight: 600,
                color: '#e8e8e8',
                lineHeight: 1.2,
                marginBottom: 16,
              },
              children: page.title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 26, color: '#8c8c8c', lineHeight: 1.4 },
              children: page.description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 18,
                color: '#3b82f6',
                fontWeight: 600,
                marginTop: 'auto',
                paddingTop: 40,
              },
              children: 'dcln.me',
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
