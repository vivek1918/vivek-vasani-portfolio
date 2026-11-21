"use client";

import { useState } from "react";
import Link from "next/link";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";

export function ExperienceView() {
  const [active, setActive] = useState(experiences[0].id);
  const current = experiences.find((item) => item.id === active) ?? experiences[0];

  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Experience</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">A short path, with the work attached.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
        Three chapters from the resume. Dates are the ones printed there. Veefin is current, so the end date stays open.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {experiences.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className="flex w-full gap-4 border-t border-[var(--line)] py-5 text-left"
              aria-pressed={item.id === current.id}
            >
              <span className="font-mono text-sm text-[var(--accent-text)]">0{index + 1}</span>
              <span>
                <span className={`block text-xl ${item.id === current.id ? "" : "text-[var(--muted)]"}`}>{item.org}</span>
                <span className="mt-1 block text-sm text-[var(--faint)]">{item.period}</span>
              </span>
            </button>
          ))}
        </div>
        <article className="lg:col-span-7 lg:col-start-6">
          <p className="kicker">{current.role}</p>
          <h2 className="mt-3 text-4xl tracking-[-0.04em]">{current.org}</h2>
          <p className="mt-2 font-mono text-sm text-[var(--muted)]">{current.period}</p>
          <p className="mt-6 text-xl leading-relaxed">{current.summary}</p>
          <ul className="mt-8 space-y-4">
            {current.points.map((point) => (
              <li key={point} className="text-lg leading-relaxed text-[var(--muted)]">
                {point}
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-2">
            {current.technologies.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
          {current.related.length > 0 ? (
            <div className="mt-8">
              <p className="kicker">Related public work</p>
              <ul className="mt-3 space-y-2">
                {current.related.map((slug) => {
                  const project = projects.find((item) => item.slug === slug);
                  if (!project) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/projects/${slug}`} className="text-lg">
                        {project.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}
