import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync } from 'node:fs';
import { SITE, THEME } from '../../lib/constants';

// satori reads WOFF (not WOFF2), which the static fontsource package ships.
const fontDir = 'node_modules/@fontsource/fraunces/files';
const fraunces = readFileSync(`${fontDir}/fraunces-latin-400-normal.woff`);
const frauncesItalic = readFileSync(`${fontDir}/fraunces-latin-400-italic.woff`);
const frauncesSemiBold = readFileSync(`${fontDir}/fraunces-latin-600-normal.woff`);

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
          position: 'relative',
          overflow: 'hidden',
          width: 1200,
          height: 630,
          padding: 64,
          background: THEME.bg,
          fontFamily: 'Fraunces',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: -10,
                bottom: -150,
                fontSize: 560,
                fontStyle: 'italic',
                lineHeight: 1,
                color: THEME.bgElevated,
              },
              children: 'd.',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 64,
                fontWeight: 600,
                color: THEME.text,
                lineHeight: 1.05,
                letterSpacing: -1,
                maxWidth: 960,
              },
              children: page.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 26,
                color: THEME.textMuted,
                lineHeight: 1.4,
                marginTop: 18,
                maxWidth: 900,
              },
              children: page.description,
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 48 },
              children: [
                {
                  type: 'div',
                  props: { style: { width: 28, height: 2, background: THEME.accent } },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 22, fontStyle: 'italic', color: THEME.accent },
                    children: SITE.name,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' as const },
        { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' as const },
        { name: 'Fraunces', data: frauncesSemiBold, weight: 600, style: 'normal' as const },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png.buffer as ArrayBuffer, { headers: { 'Content-Type': 'image/png' } });
};
