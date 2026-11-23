"use client";

import Link from "next/link";
import { useState } from "react";
import { profile } from "@/data/profile";
import { experiencesByStart } from "@/data/experience";
import { builds, interests, philosophy } from "@/data/story";
import { certificates } from "@/data/certificates";
import { projects } from "@/data/projects";
import { CertificateCard } from "@/components/certificate-card";

export function AboutView() {
  const [build, setBuild] = useState<(typeof builds)[number]["id"]>(builds[0].id);
  const current = builds.find((item) => item.id === build) ?? builds[0];
  const linked = projects.find((project) => project.slug === current.project);

  return (
    <article className="site pb-8 pt-12">
      <p className="kicker">About</p>
      <h1 className="display mt-4 max-w-4xl text-[clamp(2.2rem,9vw,5.8rem)]">A developer who wants the system to be explainable.</h1>
      <p className="mt-8 max-w-2xl text-xl leading-relaxed text-[var(--muted)]">
        I am {profile.name}, based in {profile.location}. I study {profile.education.degree} at {profile.education.school}. The work I take seriously sits where a backend, a model, or a dataset has to become something a person can run.
      </p>

      <section className="mt-20 grid gap-10 border-t border-[var(--line)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-3xl tracking-[-0.04em]">The engineering journey</h2>
        </div>
        <ol className="lg:col-span-8">
          <li className="grid gap-2 border-b border-[var(--line)] py-6 md:grid-cols-[9rem_1fr]">
            <p className="font-mono text-sm text-[var(--accent-text)]">{profile.education.period}</p>
            <div>
              <p className="text-2xl tracking-[-0.03em]">{profile.education.school}</p>
              <p className="mt-2 text-[var(--muted)]">
                {profile.education.degree}. CGPA {profile.education.cgpa}.
              </p>
            </div>
          </li>
          {experiencesByStart.map((item) => (
              <li key={item.id} className="grid gap-2 border-b border-[var(--line)] py-6 md:grid-cols-[9rem_1fr]">
                <p className="font-mono text-sm text-[var(--accent-text)]">{item.period}</p>
                <div>
                  <p className="text-2xl tracking-[-0.03em]">
                    {item.role}, {item.org}
                  </p>
                  <p className="mt-2 text-[var(--muted)]">{item.summary}</p>
                </div>
              </li>
            ))}
        </ol>
      </section>

      <section className="mt-20 border-t border-[var(--line)] pt-10">
        <h2 className="text-3xl tracking-[-0.04em]">What I like to build</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-5">
            {builds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setBuild(item.id)}
                className={`border-t border-[var(--line)] py-4 text-left text-2xl tracking-[-0.03em] ${item.id === current.id ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
                aria-pressed={item.id === current.id}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-2xl leading-snug">{current.text}</p>
            {linked ? (
              <Link href={`/projects/${linked.slug}`} className="btn-text mt-6">
                <span>See {linked.title}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl tracking-[-0.04em]">Technical interests</h2>
        </div>
        <ul>
          {interests.map((item) => (
            <li key={item.title} className="border-b border-[var(--line)] py-4">
              <p className="text-xl">{item.title}</p>
              <p className="mt-2 text-[var(--muted)]">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-[var(--line)] pt-10">
        <h2 className="text-3xl tracking-[-0.04em]">Education and what the record supports</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            {profile.education.degree} at {profile.education.school}, {profile.education.period}. CGPA {profile.education.cgpa}. At IIT Patna the resume records 96–98% accuracy on the classification algorithms DRCNN, DGAN, and EMA-IDS. PhysioPlay is described there as a Mozilla-sponsored pilot with 10 users.
          </p>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            I am not adding awards, client names, or rankings that are not on the resume or in a public repository. The certifications below are the two linked from the resume.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl tracking-[-0.04em]">Certifications</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-[var(--line)] pt-10">
        <h2 className="text-3xl tracking-[-0.04em]">Engineering philosophy</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {philosophy.map((line, index) => (
            <li key={line} className="border-t border-[var(--accent-text)] pt-4">
              <span className="kicker">0{index + 1}</span>
              <p className="mt-3 text-lg leading-relaxed">{line}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
