"use client";

import Link from "next/link";
import { useState } from "react";
import { projects } from "@/data/projects";

type Node = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  projects: string[];
};

const nodes: Node[] = [
  {
    id: "backend",
    label: "Backend Engineering",
    detail: "FastAPI and Spring Boot services, with a clear path from request to store.",
    x: 18,
    y: 28,
    projects: ["device-monitoring", "physioplay", "graphmind"],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    detail: "LLM applications where retrieval and a guard sit in front of the model.",
    x: 72,
    y: 18,
    projects: ["physioplay", "socialpulse", "graphmind"],
  },
  {
    id: "ml",
    label: "Machine Learning",
    detail: "Classification work at IIT Patna, and Prophet forecasts in the Zomato notebook.",
    x: 84,
    y: 48,
    projects: ["zomato-analysis", "seating-arrangement"],
  },
  {
    id: "data",
    label: "Databases",
    detail: "SQLite, SQL, Neo4j, Redis, and InfluxDB, chosen for the shape of the data.",
    x: 62,
    y: 74,
    projects: ["fintech-analytics", "graphmind", "device-monitoring"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    detail: "Python, Jenkins, AWS, and Docker on infrastructure work at Veefin.",
    x: 30,
    y: 78,
    projects: ["graphmind"],
  },
  {
    id: "analytics",
    label: "Data Analytics",
    detail: "Pandas, SQL, and the charts in the lending and market notebooks.",
    x: 12,
    y: 52,
    projects: ["fintech-analytics", "zomato-analysis"],
  },
  {
    id: "auto",
    label: "Automation",
    detail: "Repeatable workflows: Jenkins jobs, and the exam seating allocator.",
    x: 46,
    y: 42,
    projects: ["seating-arrangement"],
  },
];

const edges: [string, string][] = [
  ["backend", "data"],
  ["backend", "cloud"],
  ["backend", "auto"],
  ["backend", "ai"],
  ["ai", "ml"],
  ["ml", "analytics"],
  ["analytics", "data"],
  ["cloud", "auto"],
  ["data", "auto"],
];

export function EngineeringUniverse() {
  const [activeId, setActiveId] = useState(nodes[0].id);
  const active = nodes.find((node) => node.id === activeId) ?? nodes[0];
  const linked = projects.filter((project) => active.projects.includes(project.slug));

  return (
    <section className="site mt-28">
      <p className="kicker">Technical universe</p>
      <div className="mt-4 grid items-end gap-6 lg:grid-cols-12">
        <h2 className="display text-4xl md:text-6xl lg:col-span-7">The systems I actually work in.</h2>
        <p className="text-lg leading-relaxed text-[var(--muted)] lg:col-span-4 lg:col-start-9">
          Select a node. The connections are the places these areas meet in a repository or a role.
        </p>
      </div>
      <div className="universe mt-8 grid lg:grid-cols-12">
        <div className="flex flex-col lg:hidden" role="list" aria-label="Technical areas">
          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              role="listitem"
              aria-pressed={node.id === active.id}
              onClick={() => setActiveId(node.id)}
              className={`border-b border-[var(--line)] px-4 py-3 text-left ${node.id === active.id ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
            >
              {node.label}
            </button>
          ))}
        </div>
        <div className="relative hidden min-h-[520px] lg:col-span-8 lg:block" role="list" aria-label="Technical areas">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {edges.map(([from, to]) => {
              const a = nodes.find((node) => node.id === from);
              const b = nodes.find((node) => node.id === to);
              if (!a || !b) return null;
              const hot = active.id === from || active.id === to;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={hot ? "var(--accent-text)" : "rgba(255,255,255,0.14)"}
                  strokeWidth={hot ? 0.35 : 0.18}
                />
              );
            })}
          </svg>
          {nodes.map((node) => {
            const selected = node.id === active.id;
            return (
              <button
                key={node.id}
                type="button"
                role="listitem"
                aria-pressed={selected}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
                className="absolute z-10 max-w-[11rem] -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-left"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  borderColor: selected ? "var(--accent-text)" : "var(--line)",
                  background: selected ? "color-mix(in srgb, var(--lime) 12%, var(--bg))" : "var(--bg)",
                }}
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-text)]">{node.label}</span>
              </button>
            );
          })}
        </div>
        <aside className="border-t border-[var(--line)] p-6 lg:col-span-4 lg:border-l lg:border-t-0">
          <p className="kicker">Selected</p>
          <h3 className="mt-3 text-3xl tracking-[-0.04em]">{active.label}</h3>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">{active.detail}</p>
          <ul className="mt-6 space-y-3">
            {linked.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="text-lg hover:text-[var(--accent-text)]">
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
