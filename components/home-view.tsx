"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { skillGroups, skills } from "@/data/skills";
import type { GithubPayload } from "@/lib/github";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { CoreVisual } from "@/components/core-visual";
import { ProjectPreview } from "@/components/project-preview";
import { GithubExplorer } from "@/components/github-explorer";

export function HomeView({ github, focusNode }: { github: GithubPayload; focusNode?: string }) {
  return (
    <>
      <Hero />
      <AboutPreview />
      <KnowledgeGraph focusId={focusNode} />
      <Featured />
      <ExperiencePreview />
      <SkillsPreview />
      <section className="site mt-16 md:mt-28" id="github">
        <SectionLabel index="07" text="GitHub" />
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl tracking-[-0.04em] md:text-6xl">Public work, read from GitHub.</h2>
          <a className="btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
            Explore GitHub
          </a>
        </div>
        <GithubExplorer github={github} compact />
      </section>
      <ContactPreview />
    </>
  );
}

function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <p className="kicker">
      {index} — {text}
    </p>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="site grid items-center gap-8 pb-8 pt-8 lg:min-h-[calc(100vh-4.25rem)] lg:grid-cols-12 lg:pt-10">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="kicker">{profile.location}</p>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            <span className={`inline-block h-1.5 w-1.5 ${profile.availability.open ? "bg-[var(--lime)]" : "bg-[var(--faint)]"}`} aria-hidden="true" />
            {profile.availability.label}
          </p>
        </div>
        <h1 className="display mt-6 text-[clamp(2.35rem,11vw,6.6rem)]">
          {profile.heroLines.map((line, index) => (
            <motion.span
              key={line}
              className="block"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * index, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {index === 2 ? <em className="not-italic text-[var(--accent-text)]">{line}</em> : line}
            </motion.span>
          ))}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--muted)]">{profile.heroIntro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn" href="/projects" data-cursor="Work">
            Explore my work
          </Link>
          <a className="btn-ghost" href={profile.resumeFile} download>
            Download resume
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <CoreVisual />
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--faint)]">Core · pointer and scroll</p>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="site mt-16 grid gap-10 border-t border-[var(--line)] pt-10 md:mt-24 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <SectionLabel index="02" text="About" />
        <h2 className="display mt-4 text-4xl md:text-6xl">More than just writing code.</h2>
        <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">{profile.summary}</p>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          I am finishing a B.Tech in Artificial Intelligence and Data Science at Dwarkadas J. Sanghvi College of Engineering, {profile.education.period}, with a CGPA of {profile.education.cgpa}. The roles so far are an AI/ML fellowship at SimPPL, a machine learning internship at IIT Patna, and engineering work at Veefin.
        </p>
        <Link href="/about" className="btn-text mt-8" data-cursor="About">
          <span>Read the full story</span>
        </Link>
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        <ol className="border-t border-[var(--line)]">
          {[
            ["2022", "Started B.Tech, AI & Data Science"],
            ["2024", "SimPPL — AI/ML Fellow"],
            ["2025", "IIT Patna — Machine Learning Intern"],
            ["2026", "Veefin — Engineer"],
          ].map(([year, label]) => (
            <li key={year} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-[var(--line)] py-4">
              <span className="font-mono text-sm text-[var(--accent-text)]">{year}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Featured() {
  const featured = projects.filter((project) => project.featured);
  return (
    <section className="site mt-16 md:mt-28" id="projects">
      <SectionLabel index="04" text="Selected work" />
      <div className="mt-4 flex items-end justify-between gap-6">
        <h2 className="max-w-2xl text-4xl tracking-[-0.045em] md:text-6xl">Five projects with the repository behind them.</h2>
      </div>
      <div className="mt-10">
        {featured.map((project) => (
          <article key={project.slug} className="border-t border-[var(--line)] py-10">
            <div className={`grid items-center gap-8 ${project.layout === "feature" ? "lg:grid-cols-12" : "lg:grid-cols-2"}`}>
              <div className={project.layout === "feature" ? "lg:col-span-5" : project.layout === "band" ? "lg:order-2" : ""}>
                <p className="kicker">
                  {project.index} — {project.categories.join(" / ")}
                </p>
                <h3 className="mt-3 text-4xl tracking-[-0.045em] md:text-5xl">
                  <Link href={`/projects/${project.slug}`} data-cursor="Case study">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-md text-lg text-[var(--muted)]">{project.summary}</p>
                <div className="mt-6 flex flex-wrap gap-5 text-sm uppercase tracking-[0.12em]">
                  <Link href={`/projects/${project.slug}`}>View case study</Link>
                  <a href={project.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  {project.demo ? (
                    <a href={project.demo.href} target="_blank" rel="noreferrer">
                      {project.demo.label}
                    </a>
                  ) : null}
                </div>
              </div>
              <Link href={`/projects/${project.slug}`} data-cursor="Open" aria-label={`Open the ${project.title} case study`} className={project.layout === "feature" ? "lg:col-span-7" : ""}>
                <Tilt>
                  <ProjectPreview project={project} />
                </Tilt>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Tilt({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const reduce = useReducedMotion();
  return (
    <div
      className="tilt"
      style={style}
      onMouseMove={(event) => {
        if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setStyle({ transform: `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)` });
      }}
      onMouseLeave={() => setStyle({})}
    >
      {children}
    </div>
  );
}

function ExperiencePreview() {
  const [active, setActive] = useState(experiences[0].id);
  const current = experiences.find((item) => item.id === active) ?? experiences[0];
  return (
    <section className="site mt-20 border-t border-[var(--line)] pt-12">
      <SectionLabel index="05" text="Experience" />
      <h2 className="mt-4 max-w-xl text-4xl tracking-[-0.04em] md:text-5xl">Roles, with the work named.</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {experiences.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`block w-full border-t border-[var(--line)] py-4 text-left ${item.id === current.id ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
              aria-pressed={item.id === current.id}
            >
              <span className="block font-mono text-xs text-[var(--accent-text)]">{item.period}</span>
              <span className="mt-1 block text-2xl tracking-[-0.03em]">{item.org}</span>
              <span className="text-sm">{item.role}</span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="text-xl leading-relaxed">{current.summary}</p>
          <ul className="mt-6 space-y-3 text-[var(--muted)]">
            {current.points.map((point) => (
              <li key={point} className="border-l border-[var(--line-strong)] pl-4">
                {point}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-2">
            {current.technologies.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
          <Link href="/experience" className="btn-text mt-8">
            <span>Open the experience page</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SkillsPreview() {
  const [group, setGroup] = useState<(typeof skillGroups)[number]>("Programming");
  const items = skills.filter((skill) => skill.group === group);
  return (
    <section className="site mt-16 border-t border-[var(--line)] pt-10 md:mt-24">
      <SectionLabel index="06" text="Stack" />
      <h2 className="mt-4 max-w-xl text-4xl tracking-[-0.04em] md:text-5xl">Technologies tied to a project or a role.</h2>
      <div className="mt-8 flex flex-wrap gap-2">
        {skillGroups.map((item) => (
          <button key={item} type="button" className={item === group ? "btn !min-h-9" : "btn-ghost !min-h-9"} onClick={() => setGroup(item)} aria-pressed={item === group}>
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((skill) => (
          <li key={skill.id} className="bg-[var(--bg)] p-5">
            <p className="text-xl">{skill.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{skill.summary}</p>
          </li>
        ))}
      </ul>
      <Link href="/skills" className="btn-text mt-8">
        <span>Open the skills map</span>
      </Link>
    </section>
  );
}

function ContactPreview() {
  return (
    <section className="site mt-16 border-t border-[var(--line)] pt-10 md:mt-28 md:pt-14">
      <p className="kicker">08 — Contact</p>
      <h2 className="display mt-4 max-w-4xl text-[clamp(2.8rem,7vw,5.6rem)]">Let’s create something that matters.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Have an interesting idea, a challenging engineering problem, or an opportunity to collaborate? I&apos;d love to hear about it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn" href="/contact">
          Start a conversation
        </Link>
        <a className="btn-ghost" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <a className="btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="btn-ghost" href={profile.resumeFile} download>
          Resume
        </a>
      </div>
    </section>
  );
}
