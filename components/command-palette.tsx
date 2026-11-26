"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { certificates } from "@/data/certificates";
import { navItems, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { researchPapers } from "@/data/research";
import { useSite } from "@/components/providers";

type Command = { id: string; label: string; hint: string; keywords?: string; run: () => void };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useSite();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      setPaletteOpen(false);
      router.push(href);
    };
    const external = (href: string) => () => {
      setPaletteOpen(false);
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      ...navItems.map((item) => ({ id: item.href, label: item.label, hint: "Page", run: go(item.href) })),
      { id: "resume", label: "View resume", hint: "PDF", run: go("/resume") },
      {
        id: "download",
        label: "Download resume",
        hint: "PDF",
        run: () => {
          setPaletteOpen(false);
          const link = document.createElement("a");
          link.href = profile.resumeFile;
          link.download = "Vivek_Vasani_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          link.remove();
        },
      },
      { id: "github", label: "Visit GitHub", hint: "External", run: external(profile.github) },
      { id: "linkedin", label: "Visit LinkedIn", hint: "External", run: external(profile.linkedin) },
      { id: "contact", label: "Jump to contact", hint: "Page", run: go("/contact") },
      ...projects.map((project) => ({
        id: project.slug,
        label: project.title,
        hint: "Project",
        run: go(`/projects/${project.slug}`),
      })),
      ...certificates.map((certificate) => ({
        id: `cert-${certificate.id}`,
        label: certificate.name,
        hint: `Certificate · ${certificate.issuer}`,
        keywords: [
          certificate.name,
          certificate.issuer,
          ...certificate.skills,
          certificate.cluster,
          ...(certificate.relatedNodeIds ?? []),
          "certificate",
          "completion certificate",
        ].join(" "),
        run: () => {
          setPaletteOpen(false);
          window.open(certificate.href, "_blank", "noopener,noreferrer");
        },
      })),
      { id: "about-certs", label: "Browse certifications", hint: "Page", run: go("/about") },
      ...researchPapers.flatMap((paper) => [
        {
          id: `research-${paper.id}`,
          label: paper.shortTitle,
          hint: "Research",
          keywords: [paper.title, paper.category, paper.statusLabel, ...paper.authors, ...paper.technologies, "unpublished", "research"].join(" "),
          run: go(`/research#research-${paper.id}`),
        },
        {
          id: `research-read-${paper.id}`,
          label: `Read ${paper.shortTitle}`,
          hint: "PDF",
          keywords: `${paper.title} research paper pdf read unpublished ${paper.category}`,
          run: external(paper.pdfHref),
        },
        {
          id: `research-download-${paper.id}`,
          label: `Download ${paper.shortTitle} PDF`,
          hint: "PDF",
          keywords: `${paper.title} research download pdf unpublished`,
          run: () => {
            setPaletteOpen(false);
            const link = document.createElement("a");
            link.href = paper.pdfHref;
            link.download = paper.pdfFileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
          },
        },
        {
          id: `research-graph-${paper.id}`,
          label: `${paper.shortTitle} in universe`,
          hint: "Graph",
          keywords: `${paper.title} research universe ${paper.category} ${paper.technologies.join(" ")}`,
          run: go(`/?node=${paper.graphNodeId}#graph`),
        },
      ]),
    ];
  }, [router, setPaletteOpen]);

  const results = commands.filter((command) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${command.label} ${command.hint} ${command.keywords ?? ""}`.toLowerCase().includes(needle);
  });

  useEffect(() => {
    if (!paletteOpen) return;
    setQuery("");
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [paletteOpen]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!paletteOpen) return null;

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      results[active].run();
    }
  };

  return (
    <div className="overlay flex items-start justify-center px-4 pt-[12vh]" onMouseDown={() => setPaletteOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette w-full max-w-xl"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKey}
      >
        <label className="block border-b border-[var(--line)] px-4 py-3">
          <span className="sr-only">Search commands</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Go to a page, project, or profile"
            className="w-full bg-transparent text-lg outline-none"
          />
        </label>
        <ul className="max-h-80 overflow-auto py-2" role="listbox">
          {results.length === 0 ? <li className="px-4 py-6 text-[var(--muted)]">Nothing matches that search.</li> : null}
          {results.map((command, index) => (
            <li key={command.id}>
              <button
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left ${index === active ? "bg-[color-mix(in_srgb,var(--lime)_12%,transparent)]" : ""}`}
                onMouseEnter={() => setActive(index)}
                onClick={command.run}
              >
                <span>{command.label}</span>
                <span className="kicker">{command.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
