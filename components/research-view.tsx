"use client";

import Link from "next/link";
import { researchPapers, type ResearchPaper } from "@/data/research";

export function ResearchView() {
  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Research &amp; Publications</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">
        Academic research.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Papers and studies written as academic research. This page is not a product showcase.
      </p>

      <ul className="research-list">
        {researchPapers.map((paper) => (
          <li key={paper.id}>
            <ResearchCard paper={paper} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchCard({ paper }: { paper: ResearchPaper }) {
  return (
    <article className="research-card" id={`research-${paper.id}`} aria-labelledby={`research-title-${paper.id}`}>
      <span className="kicker">{paper.category}</span>

      <h2 id={`research-title-${paper.id}`} className="mt-4 text-[clamp(1.55rem,4vw,2.35rem)] tracking-[-0.04em]">
        {paper.title}
      </h2>

      <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{paper.abstract}</p>

      <dl className="research-meta">
        <div>
          <dt>Authors</dt>
          <dd>{paper.authors.join(" · ")}</dd>
        </div>
        <div>
          <dt>Institution</dt>
          <dd>{paper.institution}</dd>
        </div>
        {paper.guide ? (
          <div>
            <dt>Project guide</dt>
            <dd>{paper.guide}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8">
        <h3 className="text-xl tracking-[-0.03em]">Research areas</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {paper.areas.map((area) => (
            <li key={area} className="chip">
              {area}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-xl tracking-[-0.03em]">Technologies</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paper.technologies.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl tracking-[-0.03em]">Methodologies</h3>
          <ul className="mt-4 space-y-2 text-[var(--muted)]">
            {paper.methodologies.map((method) => (
              <li key={method} className="border-l border-[var(--line-strong)] pl-4">
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl tracking-[-0.03em]">Key findings</h3>
        <ul className="mt-4 space-y-2 text-[var(--muted)]">
          {paper.reportedFindings.map((finding) => (
            <li key={finding} className="border-l border-[var(--line-strong)] pl-4">
              {finding}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Metrics are reported as stated in the source document and are not independently verified here.
        </p>
      </div>

      <div className="resume-actions mt-8">
        <a className="btn" href={paper.pdfHref} target="_blank" rel="noreferrer">
          Read document
        </a>
        <a className="btn-ghost" href={paper.pdfHref} download={paper.pdfFileName}>
          Download PDF
        </a>
        <Link className="btn-ghost" href={`/?node=${paper.graphNodeId}#graph`}>
          Open in universe
        </Link>
      </div>
    </article>
  );
}
