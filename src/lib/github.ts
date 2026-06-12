/**
 * GitHub API utilities for fetching repository content at build time.
 */

import { highlightCodeBlocks } from './highlight';

/** Parse a GitHub repo URL into owner and repo name. */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Fetch a repo's README rendered as HTML from the GitHub API.
 *
 * Uses the `application/vnd.github.html` media type so GitHub returns
 * pre-rendered HTML — no markdown parser needed on our side.
 *
 * Returns null if the repo URL is invalid or the fetch fails.
 */
export async function fetchReadmeHtml(repoUrl: string): Promise<string | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    console.warn('[github] invalid GitHub URL:', repoUrl);
    return null;
  }

  // Unauthenticated requests share a 60/hour per-IP rate limit, which CI
  // runners regularly exhaust. This module only runs at build time
  // (project pages are prerendered), so process.env is available.
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.html',
          'User-Agent': 'dcln-portfolio',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    if (!response.ok) {
      console.warn(
        `[github] README fetch failed for ${parsed.owner}/${parsed.repo}: ${response.status}`,
      );
      return null;
    }
    const rawHtml = await response.text();
    return highlightCodeBlocks(rawHtml);
  } catch (error) {
    console.warn(`[github] README fetch error for ${parsed.owner}/${parsed.repo}:`, error);
    return null;
  }
}
