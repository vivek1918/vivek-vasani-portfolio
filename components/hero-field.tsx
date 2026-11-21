"use client";

import { useRef, useState } from "react";

const nodes = [
  { id: "backend", label: "Backend", note: "Services, APIs, Spring Boot", x: 22, y: 32 },
  { id: "ai", label: "Artificial Intelligence", note: "LLMs, RAG, NLP", x: 70, y: 26 },
  { id: "cloud", label: "Cloud", note: "AWS, Docker, Jenkins", x: 74, y: 58 },
  { id: "data", label: "Databases", note: "SQL, Neo4j, time series", x: 26, y: 60 },
  { id: "auto", label: "Automation", note: "Pipelines and workflows", x: 48, y: 16 },
];

export function HeroField() {
  const board = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<string | null>(null);
  const current = nodes.find((node) => node.id === active);

  const move = (event: React.MouseEvent) => {
    const rect = board.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setShift({ x, y });
  };

  return (
    <div
      ref={board}
      onMouseMove={move}
      onMouseLeave={() => {
        setShift({ x: 0, y: 0 });
        setActive(null);
      }}
      className="panel relative aspect-square w-full overflow-hidden"
      aria-label="Interactive map of engineering areas"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {nodes.map((node) => (
          <line
            key={node.id}
            x1={50 + shift.x * 2}
            y1={50 + shift.y * 2}
            x2={node.x + shift.x * (node.x - 50) * 0.08}
            y2={node.y + shift.y * (node.y - 50) * 0.08}
            stroke={active === node.id ? "var(--accent-text)" : "var(--line-strong)"}
            strokeWidth={active === node.id ? 0.45 : 0.25}
          />
        ))}
        <circle cx={50 + shift.x * 2} cy={50 + shift.y * 2} r="7" fill="none" stroke="var(--accent-text)" strokeWidth="0.4" />
      </svg>
      <p className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-2xl tracking-[-0.06em]">VV.</p>
      {nodes.map((node) => (
        <button
          key={node.id}
          type="button"
          onMouseEnter={() => setActive(node.id)}
          onFocus={() => setActive(node.id)}
          onBlur={() => setActive(null)}
          className="absolute z-10 max-w-[8.5rem] -translate-x-1/2 -translate-y-1/2 border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-left"
          style={{
            left: `${node.x + shift.x * (node.x - 50) * 0.15}%`,
            top: `${node.y + shift.y * (node.y - 50) * 0.15}%`,
          }}
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-text)]">{node.label}</span>
        </button>
      ))}
      <p className="absolute bottom-0 left-0 right-0 z-20 border-t border-[var(--line)] bg-[var(--bg)] px-3 py-2 font-mono text-[11px] text-[var(--muted)]">
        {current ? current.note : "Hover a node. The map is the work, not a decoration."}
      </p>
    </div>
  );
}
