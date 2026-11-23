"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projectCategories, projects } from "@/data/projects";
import type { GithubPayload } from "@/lib/github";
import { ProjectPreview } from "@/components/project-preview";
import { GithubExplorer } from "@/components/github-explorer";

export function ProjectsView({ github }: { github: GithubPayload }) {
  const [category, setCategory] = useState("All");
  const [tech, setTech] = useState("All");
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();
  const technologies = useMemo(() => Array.from(new Set(projects.flatMap((project) => project.stack))).sort(), []);

  const visible = projects.filter((project) => {
    const categoryOk = category === "All" || project.categories.includes(category);
    const techOk = tech === "All" || project.stack.includes(tech);
    const needle = query.trim().toLowerCase();
    const text = [project.title, project.summary, ...project.stack, ...project.categories].join(" ").toLowerCase();
    return categoryOk && techOk && (!needle || text.includes(needle));
  });

  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Projects</p>
      <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h1 className="max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">Engineering showcase</h1>
        <p className="font-mono text-sm text-[var(--muted)]">
          {visible.length} of {projects.length} case studies
        </p>
      </div>
      <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
        Five featured builds, plus three more that earned a page because the repository shows real engineering. Everything else stays in the GitHub list, with its published description.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Category">
          {["All", ...projectCategories].map((item) => (
            <button key={item} type="button" className={item === category ? "btn !min-h-9" : "btn-ghost !min-h-9"} onClick={() => setCategory(item)} aria-pressed={item === category}>
              {item}
            </button>
          ))}
        </div>
        <label className="max-w-md">
          <span className="kicker">Search</span>
          <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Project, stack, or category" />
        </label>
        <label className="max-w-xs text-sm">
          <span className="kicker">Technology</span>
          <select className="field" value={tech} onChange={(event) => setTech(event.target.value)}>
            <option>All</option>
            {technologies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.article
              layout={!reduce}
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="grid items-center gap-6 border-t border-[var(--line)] py-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-6">
                <p className="kicker">
                  {project.index} — {project.categories.join(" · ")}
                  {project.featured ? " · Featured" : ""}
                </p>
                <h2 className="mt-2 text-4xl tracking-[-0.04em]">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <p className="mt-3 max-w-md text-[var(--muted)]">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a className="btn-ghost" href={project.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  {project.demo ? (
                    <a className="btn" href={project.demo.href} target="_blank" rel="noreferrer">
                      {project.demo.label}
                    </a>
                  ) : null}
                </div>
              </div>
              <Link href={`/projects/${project.slug}`} className="lg:col-span-6" data-cursor="Case study" aria-label={`Open the ${project.title} case study`}>
                <ProjectPreview project={project} />
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
        {visible.length === 0 ? (
          <div className="border border-[var(--line)] px-6 py-16">
            <p className="text-3xl tracking-[-0.04em]">No case studies match.</p>
            <button
              type="button"
              className="btn mt-6"
              onClick={() => {
                setCategory("All");
                setTech("All");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      <section className="mt-20 border-t border-[var(--line)] pt-12" id="github">
        <h2 className="text-4xl tracking-[-0.04em]">Explore more on GitHub</h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          This list is the public GitHub account. Descriptions are the ones published on each repository. A case study link appears only when I have written one.
        </p>
        <GithubExplorer github={github} />
      </section>
    </div>
  );
}
