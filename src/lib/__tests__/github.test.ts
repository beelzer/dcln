import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchReadmeHtml } from '../github';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchReadmeHtml', () => {
  it('returns null for invalid GitHub URLs', async () => {
    expect(await fetchReadmeHtml('https://example.com/foo')).toBeNull();
    expect(await fetchReadmeHtml('')).toBeNull();
    expect(await fetchReadmeHtml('not-a-url')).toBeNull();
  });

  it('fetches README HTML from GitHub API', async () => {
    const mockHtml = '<h1>Hello</h1>';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(mockHtml, { status: 200 }));

    const result = await fetchReadmeHtml('https://github.com/beelzer/dcln');
    expect(result).toBe(mockHtml);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/beelzer/dcln/readme',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.html',
        }),
      }),
    );
  });

  it('strips .git suffix from repo URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('<h1>Test</h1>', { status: 200 }),
    );

    await fetchReadmeHtml('https://github.com/beelzer/dcln.git');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/beelzer/dcln/readme',
      expect.any(Object),
    );
  });

  it('returns null on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

    expect(await fetchReadmeHtml('https://github.com/beelzer/dcln')).toBeNull();
  });

  it('returns null on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    expect(await fetchReadmeHtml('https://github.com/beelzer/dcln')).toBeNull();
  });
});
