/**
 * GitHub API utilities for fetching repository content at build time.
 */

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
  if (!parsed) return null;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.html',
          'User-Agent': 'dcln-portfolio',
        },
      },
    );

    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}
