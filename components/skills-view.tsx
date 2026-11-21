"use client";

import { useState } from "react";
import Link from "next/link";
import { skillGroups, skills } from "@/data/skills";
import { projects } from "@/data/projects";

export function SkillsView() {
  const [id, setId] = useState("python");
  const current = skills.find((skill) => skill.id === id) ?? skills[0];

  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Skills</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">A stack with a reason next to it.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
        No percentage bars. Select a technology to see where it shows up — a repository, a role, or only the resume.
      </p>
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          {skillGroups.map((group) => (
            <section key={group} className="mb-8">
              <h2 className="kicker">{group}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.group === group)
                  .map((skill) => (
                    <button key={skill.id} type="button" className={skill.id === current.id ? "btn !min-h-9" : "btn-ghost !min-h-9"} onClick={() => setId(skill.id)} aria-pressed={skill.id === current.id}>
                      {skill.name}
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </div>
        <article className="border border-[var(--line)] p-6 lg:sticky lg:top-24 lg:col-span-5 lg:col-start-8 lg:self-start">
          <p className="kicker">{current.group}</p>
          <h2 className="mt-3 text-4xl tracking-[-0.04em]">{current.name}</h2>
          <p className="mt-4 text-lg leading-relaxed">{current.summary}</p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">{current.usedFor}</p>
          <div className="mt-6">
            <p className="kicker">Projects</p>
            {current.projects.length === 0 ? <p className="mt-2 text-[var(--muted)]">No public case study uses this as a primary tool.</p> : null}
            <ul className="mt-2 space-y-2">
              {current.projects.map((slug) => {
                const project = projects.find((item) => item.slug === slug);
                if (!project) return null;
                return (
                  <li key={slug}>
                    <Link href={`/projects/${slug}`}>{project.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-6">
            <p className="kicker">Experience</p>
            <p className="mt-2 text-[var(--muted)]">{current.experience.length ? current.experience.join(" · ") : "Not tied to a specific role on the resume."}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
