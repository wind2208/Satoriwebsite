import 'server-only';

interface RepoSnapshot {
  stars: number | null;
  openIssues: number | null;
  latestRelease: string | null;
  latestReleaseUrl: string | null;
}

const REVALIDATE_SECONDS = 3600;

function authHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function getRepoStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: [`gh:${repo}`] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function getRepoSnapshot(repo: string): Promise<RepoSnapshot> {
  const empty: RepoSnapshot = {
    stars: null,
    openIssues: null,
    latestRelease: null,
    latestReleaseUrl: null,
  };

  try {
    const [repoRes, releaseRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: authHeaders(),
        next: { revalidate: REVALIDATE_SECONDS, tags: [`gh:${repo}`] },
      }),
      fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers: authHeaders(),
        next: { revalidate: REVALIDATE_SECONDS, tags: [`gh:${repo}:release`] },
      }),
    ]);

    const out: RepoSnapshot = { ...empty };

    if (repoRes.ok) {
      const data = (await repoRes.json()) as { stargazers_count?: number; open_issues_count?: number };
      out.stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
      out.openIssues = typeof data.open_issues_count === 'number' ? data.open_issues_count : null;
    }

    if (releaseRes.ok) {
      const data = (await releaseRes.json()) as { name?: string; tag_name?: string; html_url?: string };
      out.latestRelease = data.name ?? data.tag_name ?? null;
      out.latestReleaseUrl = data.html_url ?? null;
    }

    return out;
  } catch {
    return empty;
  }
}
