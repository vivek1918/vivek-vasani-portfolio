"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { experiences, type Experience } from "@/data/experience";
import { projects } from "@/data/projects";

const stats = [
  { value: "8", label: "Professional experiences" },
  { value: "5", label: "Domains: AI/ML, backend, software engineering, operations, and UI/UX" },
  { value: "1", label: "Remote collaboration with a New York organization, SimPPL" },
];

export function ExperienceView() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string[]>(["veefin"]);

  const toggle = (id: string) => {
    setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Experience</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">The work, newest first.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Eight roles, newest first. The current software engineering post is Veefin. Programmatix examination operations also run through the present.
      </p>

      <ul className="xp-stats">
        {stats.map((item) => (
          <li key={item.label}>
            <span>{item.value}</span>
            <p>{item.label}</p>
          </li>
        ))}
      </ul>

      <ol className="xp-list">
        {experiences.map((item, index) => (
          <ExperienceCard key={item.id} item={item} index={index} open={open.includes(item.id)} reduce={Boolean(reduce)} onToggle={() => toggle(item.id)} />
        ))}
      </ol>
    </div>
  );
}

function ExperienceCard({
  item,
  index,
  open,
  reduce,
  onToggle,
}: {
  item: Experience;
  index: number;
  open: boolean;
  reduce: boolean;
  onToggle: () => void;
}) {
  const panelId = `${item.id}-details`;
  return (
    <motion.li
      className={item.id === "veefin" ? "xp-item xp-current" : "xp-item"}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.04 }}
    >
      <span className="xp-mark" aria-hidden="true" />
      <article className="xp-card">
        <div className="flex flex-wrap items-center gap-2">
          {item.id === "veefin" ? <span className="xp-badge">Current role</span> : null}
          {item.current && item.id !== "veefin" ? <span className="xp-badge xp-badge-quiet">Also current</span> : null}
          <span className="kicker">{item.employmentType}</span>
        </div>
        <h2 className="mt-3 text-[clamp(1.6rem,4vw,2.4rem)] tracking-[-0.04em]">{item.role}</h2>
        <p className="mt-1 text-xl">{item.org}</p>
        <p className="mt-3 font-mono text-sm leading-relaxed text-[var(--muted)]">
          {item.period}
          {" · "}
          {item.workMode}
          {item.location ? ` · ${item.location}` : ""}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{item.summary}</p>
        {item.points.length > 0 ? (
          <>
            <button type="button" className="xp-toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
              {open ? "Hide the work" : "Read the work"}
            </button>
            {open ? (
              <ul id={panelId} className="mt-4 space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="border-l border-[var(--line-strong)] pl-4 leading-relaxed text-[var(--muted)]">
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
        <ul className="mt-5 flex flex-wrap gap-2">
          {item.technologies.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        {item.projectLinks && item.projectLinks.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {item.projectLinks.map((link) => (
              <a key={link.href} className="btn" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        {item.related.length > 0 ? (
          <div className="mt-5">
            <p className="kicker">Related public work</p>
            <ul className="mt-2 space-y-2">
              {item.related.map((slug) => {
                const project = projects.find((entry) => entry.slug === slug);
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
    </motion.li>
  );
}
