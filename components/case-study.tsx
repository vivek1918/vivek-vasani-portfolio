import Link from "next/link";
import type { Project } from "@/data/projects";
import { graphNode } from "@/data/graph";
import { ProjectMark } from "@/components/project-mark";
import { ArchitectureMap } from "@/components/architecture-map";

export function CaseStudy({ project, related }: { project: Project; related: Project[] }) {
  const inGraph = graphNode(project.slug);
  return (
    <article className="site pb-8 pt-12">
      <p className="kicker">
        <Link href="/projects">Projects</Link>
        {" / "}
        {project.categories.join(" · ")}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.05em]">{project.title}</h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-[var(--muted)]">{project.summary}</p>
        </div>
        <div className="lg:col-span-5 lg:pt-4">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn" href={project.github} target="_blank" rel="noreferrer">
              GitHub repository
            </a>
            {project.demo ? (
              <a
                className={project.slug === "physioplay" ? "btn" : "btn-ghost"}
                href={project.demo.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.demo.label}
              </a>
            ) : null}
          </div>
          {project.slug === "physioplay" && project.demo ? (
            <p className="mt-4 break-all text-sm text-[var(--muted)]">
              Official site:{" "}
              <a href={project.demo.href} target="_blank" rel="noreferrer">
                {project.demo.href}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10">
        <ProjectMark slug={project.slug} />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <Block title="Overview" text={project.overview} />
          <Block title="Problem" text={project.problem} />
          <Block title="Why it was built" text={project.why} />
          <Block title="My contribution" text={project.contribution} />
        </div>
        <aside className="h-fit border border-[var(--line)] p-5 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9">
          <p className="kicker">On this page</p>
          <ul className="mt-4 space-y-2 text-[var(--muted)]">
            {["Overview", "Architecture", "Features", "Challenges", "Implementation"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>

      {project.architecture ? (
        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-3xl tracking-[-0.04em]">Technical architecture</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">Select a node. The labels follow the modules and stores that are actually in the repository.</p>
          <div className="mt-6">
            <ArchitectureMap project={project} />
          </div>
        </section>
      ) : null}

      <section className="mt-16 grid gap-10 border-t border-[var(--line)] pt-10 md:grid-cols-2">
        <List title="Key features" items={project.features} />
        <List title="Engineering challenges" items={project.challenges} />
      </section>

      <section className="mt-16 border-t border-[var(--line)] pt-10">
        <h2 className="text-3xl tracking-[-0.04em]">Implementation</h2>
        <ol className="mt-6 space-y-4">
          {project.implementation.map((item, index) => (
            <li key={item} className="grid gap-3 border-b border-[var(--line)] pb-4 md:grid-cols-[3rem_1fr]">
              <span className="font-mono text-sm text-[var(--accent-text)]">{String(index + 1).padStart(2, "0")}</span>
              <p className="text-lg leading-relaxed">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      {project.documents && project.documents.length > 0 ? (
        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-3xl tracking-[-0.04em]">Supporting documents</h2>
          <ul className="doc-list">
            {project.documents.map((document) => (
              <li key={document.id} className="xp-cert">
                <p className="kicker">{document.kind}</p>
                <p className="mt-2 text-2xl tracking-[-0.03em]">{document.title}</p>
                <p className="mt-3 text-[var(--muted)]">{document.summary}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a className="btn" href={document.href} target="_blank" rel="noreferrer">
                    Read document
                  </a>
                  <a className="btn-ghost" href={document.href} download={document.fileName}>
                    Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {inGraph ? (
        <p className="mt-16 border-t border-[var(--line)] pt-10">
          <Link href={`/?node=${project.slug}#graph`} className="btn-text">
            <span>See {project.title} in the engineering universe</span>
          </Link>
        </p>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-3xl tracking-[-0.04em]">Related projects</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/projects/${item.slug}`} className="border-t border-[var(--line)] pt-4">
                <p className="kicker">{item.categories[0]}</p>
                <p className="mt-2 text-3xl tracking-[-0.04em]">{item.title}</p>
                <p className="mt-2 text-[var(--muted)]">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="kicker">{title}</h2>
      <p className="mt-3 text-xl leading-relaxed">{text}</p>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-3xl tracking-[-0.04em]">{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="border-l border-[var(--accent-text)] pl-4 leading-relaxed text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
