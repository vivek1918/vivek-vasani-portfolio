"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

export function ArchitectureMap({ project }: { project: Project }) {
  const architecture = project.architecture;
  const [active, setActive] = useState(architecture?.nodes[0]?.id ?? "");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  if (!architecture) return null;
  const node = architecture.nodes.find((item) => item.id === active) ?? architecture.nodes[0];
  const columns = Math.min(3, architecture.nodes.length);
  const width = 120 + columns * 180;
  const rows = Math.ceil(architecture.nodes.length / columns);
  const height = 80 + rows * 120;
  const points = architecture.nodes.map((item, index) => ({
    id: item.id,
    label: item.label,
    x: 100 + (index % columns) * 180,
    y: 56 + Math.floor(index / columns) * 120,
  }));
  const at = (id: string) => points.find((item) => item.id === id);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="group" aria-label={`${project.title} architecture`}>
        {architecture.edges.map(([from, to]) => {
          const start = at(from);
          const end = at(to);
          if (!start || !end) return null;
          const live = !reduced && (from === node.id || to === node.id);
          return (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={from === node.id || to === node.id ? "var(--accent-text)" : "var(--line-strong)"}
              strokeWidth={from === node.id || to === node.id ? 1.6 : 1}
              className={live ? "graph-hot" : undefined}
            />
          );
        })}
        {points.map((item) => (
          <g key={item.id} transform={`translate(${item.x} ${item.y})`}>
            <circle r={item.id === node.id ? 16 : 11} fill={item.id === node.id ? "var(--lime)" : "var(--bg-raise)"} stroke="var(--ink)" />
            <text y="32" textAnchor="middle" fill="var(--ink)" fontSize="13" fontFamily="var(--font-mono), monospace">
              {item.label}
            </text>
            <circle
              r="22"
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={item.label}
              aria-pressed={item.id === node.id}
              style={{ cursor: "pointer" }}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(item.id);
                }
              }}
            />
          </g>
        ))}
      </svg>
      <div className="mt-4 border border-[var(--line)] p-5">
        <p className="kicker">How this piece connects</p>
        <p className="mt-3 text-xl leading-snug">{node.detail}</p>
        <p className="mt-4 font-mono text-xs text-[var(--muted)]">
          {architecture.edges
            .filter((edge) => edge[0] === node.id || edge[1] === node.id)
            .map((edge) => {
              const other = edge[0] === node.id ? edge[1] : edge[0];
              const label = architecture.nodes.find((item) => item.id === other)?.label;
              return `${node.label} — ${label}`;
            })
            .join("   ·   ")}
        </p>
      </div>
    </div>
  );
}
