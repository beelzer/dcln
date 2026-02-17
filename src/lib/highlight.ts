/**
 * Build-time syntax highlighting for GitHub README HTML using Shiki.
 *
 * Parses HTML to find <pre><code> blocks, detects the language,
 * and replaces them with Shiki-highlighted output. Zero client-side JS.
 */

import { getSingletonHighlighter, bundledLanguages } from 'shiki';
import type { BundledLanguage } from 'shiki';
import { parse, renderSync, ELEMENT_NODE, TEXT_NODE } from 'ultrahtml';
import type { Node } from 'ultrahtml';
import { querySelectorAll } from 'ultrahtml/selector';

/** Extract raw text content from an ultrahtml AST node, recursively. */
function extractText(node: Node): string {
  if (node.type === TEXT_NODE) return (node as { value: string }).value;
  if ('children' in node) {
    return (node.children as Node[]).map(extractText).join('');
  }
  return '';
}

/** Normalize a language identifier to a Shiki-compatible language ID. */
function normalizeLanguage(lang: string): string {
  const lower = lang.toLowerCase().replace(/^source-/, '');
  const aliases: Record<string, string> = {
    sh: 'bash',
    zsh: 'bash',
    yml: 'yaml',
  };
  return aliases[lower] ?? lower;
}

/** Detect the language from a <pre> and its <code> child. */
function detectLanguage(
  preAttrs: Record<string, string>,
  codeAttrs: Record<string, string>,
): string {
  // 1. <pre lang="...">
  if (preAttrs.lang) return normalizeLanguage(preAttrs.lang);

  // 2. <code class="language-*"> or <code class="highlight-source-*"> or <code class="highlight-*">
  const classes = (codeAttrs.class || '').split(/\s+/);
  for (const cls of classes) {
    const match = cls.match(/^(?:language-|highlight-source-|highlight-)(.+)$/);
    if (match) return normalizeLanguage(match[1]);
  }

  return 'plaintext';
}

/**
 * Highlight all code blocks in an HTML string using Shiki.
 *
 * Finds `<pre>` elements containing a `<code>` child, detects the language,
 * and replaces them with Shiki-highlighted output using the github-dark theme.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
  const highlighter = await getSingletonHighlighter({
    themes: ['github-dark'],
    langs: [],
  });

  const ast = parse(html);
  const preNodes = querySelectorAll(ast, 'pre');

  for (const preNode of preNodes) {
    if (preNode.type !== ELEMENT_NODE) continue;

    const codeNode = (preNode.children as Node[]).find(
      (child) => child.type === ELEMENT_NODE && (child as { name: string }).name === 'code',
    );
    if (!codeNode) continue;

    const codeText = extractText(codeNode);
    if (!codeText.trim()) continue;

    const lang = detectLanguage(
      preNode.attributes ?? {},
      (codeNode as { attributes: Record<string, string> }).attributes ?? {},
    );

    // Load language on demand if available
    if (lang !== 'plaintext' && lang in bundledLanguages) {
      await highlighter.loadLanguage(lang as BundledLanguage);
    }

    const validLang = highlighter.getLoadedLanguages().includes(lang) ? lang : 'plaintext';

    const highlighted = highlighter.codeToHtml(codeText, {
      lang: validLang,
      theme: 'github-dark',
      transformers: [
        {
          pre(node) {
            // Strip Shiki's background-color so our CSS tokens apply
            if (node.properties.style) {
              node.properties.style = String(node.properties.style)
                .replace(/background-color:[^;]+;?/, '')
                .trim();
            }
          },
        },
      ],
    });

    // Replace the original <pre> node in the AST
    const highlightedAst = parse(highlighted);
    const parent = preNode.parent as { children: Node[] };
    const index = parent.children.indexOf(preNode);
    if (index !== -1 && highlightedAst.children[0]) {
      parent.children[index] = highlightedAst.children[0];
    }
  }

  return renderSync(ast);
}
