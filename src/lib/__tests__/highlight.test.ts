import { describe, it, expect } from 'vitest';
import { highlightCodeBlocks } from '../highlight';

describe('highlightCodeBlocks', () => {
  it('highlights a code block with language-* class', async () => {
    const input = '<pre><code class="language-javascript">const x = 1;</code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).toContain('class="shiki');
    expect(result).toContain('<span');
  });

  it('highlights a code block with pre lang attribute', async () => {
    const input = '<pre lang="typescript"><code>const x: number = 1;</code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).toContain('class="shiki');
  });

  it('highlights a code block with highlight-source-* class', async () => {
    const input =
      '<pre><code class="highlight highlight-source-python notranslate">print("hello")</code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).toContain('class="shiki');
  });

  it('falls back to plaintext for unknown language', async () => {
    const input = '<pre><code class="language-nonexistent">hello world</code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).toContain('class="shiki');
  });

  it('passes through HTML without code blocks unchanged', async () => {
    const input = '<h1>Hello</h1><p>World</p>';
    const result = await highlightCodeBlocks(input);

    expect(result).toContain('<h1>');
    expect(result).toContain('<p>');
  });

  it('does not add background-color inline style', async () => {
    const input = '<pre><code class="language-js">const x = 1;</code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).not.toContain('background-color');
  });

  it('skips empty code blocks', async () => {
    const input = '<pre><code class="language-js">   </code></pre>';
    const result = await highlightCodeBlocks(input);

    expect(result).not.toContain('class="shiki');
  });
});
