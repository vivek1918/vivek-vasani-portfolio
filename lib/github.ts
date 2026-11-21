import { githubSnapshot, type GithubRepoSnapshot } from "@/data/github-snapshot";

export type GithubEvent = {
  id: string;
  repo: string;
  date: string;
  type: string;
};

export type GithubPayload = {
  source: "live" | "snapshot";
  fetchedAt: string;
  publicRepos: number;
  followers: number;
  following: number;
  repos: GithubRepoSnapshot[];
  activity: GithubEvent[];
};

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  html_url: string;
  homepage: string | null;
  pushed_at: string | null;
};

type ApiEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
};

function mapRepo(repo: ApiRepo): GithubRepoSnapshot {
  return {
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count ?? 0,
    fork: Boolean(repo.fork),
    url: repo.html_url,
    homepage: repo.homepage,
    updated: (repo.pushed_at || "").slice(0, 10),
  };
}

export async function getGithub(): Promise<GithubPayload> {
  const fallback: GithubPayload = {
    source: "snapshot",
    fetchedAt: githubSnapshot.fetchedAt,
    publicRepos: githubSnapshot.publicRepos,
    followers: githubSnapshot.followers,
    following: githubSnapshot.following,
    repos: githubSnapshot.repos,
    activity: [
      {
        id: "snapshot-envguard",
        repo: "vivek1918/envguard",
        date: "2026-10-28",
        type: "PushEvent",
      },
      {
        id: "snapshot-employee",
        repo: "vivek1918/employee-management-service-1a-EnvGuard-repo",
        date: "2026-10-28",
        type: "PushEvent",
      },
    ],
  };

  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "vivek-vasani-portfolio",
    };
    const [userRes, repoRes, eventRes] = await Promise.all([
      fetch("https://api.github.com/users/vivek1918", { headers, next: { revalidate: 3600 } }),
      fetch("https://api.github.com/users/vivek1918/repos?per_page=100&sort=updated", {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch("https://api.github.com/users/vivek1918/events/public?per_page=30", {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok || !repoRes.ok) return fallback;

    const user = (await userRes.json()) as { public_repos?: number; followers?: number; following?: number };
    const repos = (await repoRes.json()) as ApiRepo[];
    if (!Array.isArray(repos)) return fallback;

    let activity: GithubEvent[] = [];
    if (eventRes.ok) {
      const events = (await eventRes.json()) as ApiEvent[];
      if (Array.isArray(events)) {
        const seen = new Set<string>();
        activity = events
          .filter((event) => event.type === "PushEvent" || event.type === "CreateEvent")
          .map((event) => ({
            id: event.id,
            repo: event.repo?.name || "repository",
            date: (event.created_at || "").slice(0, 10),
            type: event.type,
          }))
          .filter((event) => {
            const key = `${event.repo}-${event.date}-${event.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 6);
      }
    }

    return {
      source: "live",
      fetchedAt: new Date().toISOString().slice(0, 10),
      publicRepos: user.public_repos ?? repos.length,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      repos: repos.map(mapRepo).sort((a, b) => b.updated.localeCompare(a.updated)),
      activity,
    };
  } catch {
    return fallback;
  }
}
