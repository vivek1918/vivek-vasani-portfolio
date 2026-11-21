"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import type { GithubPayload } from "@/lib/github";

const repoCaseStudy: Record<string, string> = Object.fromEntries(projects.map((project) => [project.repoName, project.slug]));

export function GithubExplorer({ github, compact = false }: { github: GithubPayload; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(!compact);
  const repos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return github.repos.filter((repo) => {
      if (!needle) return true;
      return [repo.name, repo.description || "", repo.language || ""].join(" ").toLowerCase().includes(needle);
    });
  }, [github.repos, query]);

  const preview = compact ? github.repos.filter((repo) => !repo.fork).slice(0, 4) : repos;

  return (
    <div className="mt-8">
      <dl className="grid grid-cols-3 gap-px border border-[var(--line)] bg-[var(--line)]">
        {[
          ["Public repos", String(github.publicRepos)],
          ["Followers", String(github.followers)],
          ["Following", String(github.following)],
        ].map(([label, value]) => (
          <div key={label} className="bg-[var(--bg)] px-4 py-4">
            <dt className="kicker">{label}</dt>
            <dd className="mt-2 text-3xl tracking-[-0.04em]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 font-mono text-xs text-[var(--faint)]">
        {github.source === "live" ? `Live public data · ${github.fetchedAt}` : `Saved public snapshot from ${github.fetchedAt}. Live GitHub data was unavailable.`}
      </p>

      {compact ? (
        <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {preview.map((repo) => (
            <li key={repo.name} className="flex flex-col gap-2 py-4 md:flex-row md:items-baseline md:justify-between">
              <div>
                <a href={repo.url} target="_blank" rel="noreferrer" className="text-lg">
                  {repo.name}
                </a>
                <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">{repo.description || "No description published."}</p>
              </div>
              <p className="font-mono text-xs text-[var(--faint)]">
                {repo.language || "—"} · {repo.stars} stars · {repo.updated}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {github.activity.length > 0 ? (
        <div className="mt-6">
          <p className="kicker">Recent public activity</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {github.activity.map((event) => (
              <li key={event.id}>
                {event.type === "PushEvent" ? "Pushed to" : "Created"} {event.repo.replace("vivek1918/", "")} · {event.date}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[var(--muted)]">Recent public events were not returned by the GitHub API.</p>
      )}

      <button type="button" className="btn-ghost mt-6" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? "Hide repository list" : `Browse all ${github.repos.length} public repositories`}
      </button>

      {open ? (
        <div className="mt-4">
          <label className="block">
            <span className="kicker">Search repositories</span>
            <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, language, or description" />
          </label>
          <p className="mt-3 font-mono text-xs text-[var(--faint)]">{repos.length} shown</p>
          <ul className="mt-2 divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {repos.map((repo) => {
              const slug = repoCaseStudy[repo.name];
              return (
                <li key={repo.name} className="grid gap-2 py-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-start">
                  <div>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                      {repo.fork ? " · fork" : ""}
                    </a>
                    <p className="mt-1 text-sm text-[var(--muted)]">{repo.description || "No description published."}</p>
                  </div>
                  <p className="font-mono text-xs text-[var(--faint)]">
                    {repo.language || "—"} · {repo.stars} stars · updated {repo.updated || "—"}
                  </p>
                  {slug ? (
                    <Link href={`/projects/${slug}`} className="text-sm uppercase tracking-[0.12em] text-[var(--accent-text)]">
                      Case study
                    </Link>
                  ) : (
                    <span />
                  )}
                </li>
              );
            })}
          </ul>
          {repos.length === 0 ? <p className="py-8 text-[var(--muted)]">No repositories match that search.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
