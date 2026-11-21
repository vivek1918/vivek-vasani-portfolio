"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import {
  graphFilters,
  graphLinks,
  graphNode,
  graphNodes,
  graphPaths,
  neighborsOf,
  pathEdge,
  visibleNodeIds,
  type GraphFilter,
  type GraphNode,
} from "@/data/graph";

type SimNode = SimulationNodeDatum & GraphNode;

const kindColor: Record<GraphNode["kind"], string> = {
  language: "var(--node-language)",
  technology: "var(--node-technology)",
  tool: "var(--node-tool)",
  project: "var(--node-project)",
  experience: "var(--node-experience)",
  concept: "var(--node-concept)",
};

export function KnowledgeGraph({ focusId }: { focusId?: string }) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const linkRefs = useRef(new Map<string, SVGLineElement>());
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null);
  const dragRef = useRef<{ id: string; moved: boolean; x: number; y: number } | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const fitRef = useRef<(force?: boolean) => void>(() => {});
  const fitted = useRef(false);
  const [filter, setFilter] = useState<GraphFilter>("All");
  const [query, setQuery] = useState("");
  const [pathId, setPathId] = useState<string | null>(null);
  const [selected, setSelected] = useState(focusId && graphNode(focusId) ? focusId : "python");
  const [hovered, setHovered] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 40, y: 24, k: 1 });
  const [compact, setCompact] = useState(false);

  const path = graphPaths.find((item) => item.id === pathId) ?? null;
  const visible = useMemo(() => {
    const ids = visibleNodeIds(filter, query);
    path?.nodes.forEach((id) => ids.add(id));
    return ids;
  }, [filter, path, query]);
  const nodes = graphNodes.filter((node) => visible.has(node.id));
  const links = graphLinks.filter((link) => visible.has(link.source) && visible.has(link.target));
  const active = graphNode(selected);
  const related = useMemo(() => {
    if (path) return new Set(path.nodes);
    return selected ? new Set([selected, ...neighborsOf(selected)]) : new Set<string>();
  }, [path, selected]);

  useEffect(() => {
    if (focusId && graphNode(focusId)) setSelected(focusId);
  }, [focusId]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const ids = visibleNodeIds(filter, query);
    graphPaths.find((item) => item.id === pathId)?.nodes.forEach((id) => ids.add(id));
    const sourceNodes = graphNodes.filter((node) => ids.has(node.id));
    const sourceLinks = graphLinks.filter((link) => ids.has(link.source) && ids.has(link.target));
    const simNodes: SimNode[] = sourceNodes.map((node) => {
      const previous = positions.current.get(node.id);
      return { ...node, x: previous?.x ?? 480 + (Math.random() - 0.5) * 80, y: previous?.y ?? 280 + (Math.random() - 0.5) * 80 };
    });
    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink<SimNode, { source: string; target: string }>(sourceLinks.map((link) => ({ ...link })))
          .id((node) => node.id)
          .distance(compact ? 78 : 108)
          .strength(0.42),
      )
      .force("charge", forceManyBody().strength(compact ? -160 : -240))
      .force("center", forceCenter(500, 300))
      .force("x", forceX(500).strength(0.08))
      .force("y", forceY(300).strength(0.08))
      .force("collide", forceCollide(compact ? 26 : 34))
      .alpha(0.95);

    const paint = () => {
      simNodes.forEach((node) => {
        positions.current.set(node.id, { x: node.x ?? 0, y: node.y ?? 0 });
        nodeRefs.current.get(node.id)?.setAttribute("transform", `translate(${node.x ?? 0},${node.y ?? 0})`);
      });
      sourceLinks.forEach((link) => {
        const source = simNodes.find((node) => node.id === link.source);
        const target = simNodes.find((node) => node.id === link.target);
        const line = linkRefs.current.get(`${link.source}|${link.target}`);
        if (!source || !target || !line) return;
        line.setAttribute("x1", String(source.x ?? 0));
        line.setAttribute("y1", String(source.y ?? 0));
        line.setAttribute("x2", String(target.x ?? 0));
        line.setAttribute("y2", String(target.y ?? 0));
      });
    };

    sim.on("tick", paint);
    sim.on("end", () => {
      paint();
      requestAnimationFrame(() => fitRef.current(false));
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      for (let step = 0; step < 140; step += 1) sim.tick();
      sim.stop();
      paint();
      requestAnimationFrame(() => fitRef.current(false));
    }
    simRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [compact, filter, pathId, query]);

  useLayoutEffect(() => {
    positions.current.forEach((point, id) => {
      nodeRefs.current.get(id)?.setAttribute("transform", `translate(${point.x},${point.y})`);
    });
  });

  useEffect(() => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.55, 2.6])
      .filter((event) => {
        if (event.type === "wheel") return true;
        const target = event.target;
        return !(target instanceof Element && target.closest("[data-node]"));
      })
      .on("zoom", (event) => {
        const next = event.transform;
        setTransform({ x: next.x, y: next.y, k: next.k });
      });
    const selection = select(svg);
    selection.call(behavior);
    selection.call(behavior.transform, zoomIdentity.translate(40, 24));
    zoomRef.current = behavior;
    return () => {
      selection.on(".zoom", null);
      zoomRef.current = null;
    };
  }, []);

  fitRef.current = (force = false) => {
    if (!force && fitted.current) return;
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior) return;
    const points = Array.from(visible)
      .map((id) => positions.current.get(id))
      .filter((point): point is { x: number; y: number } => Boolean(point));
    if (points.length < 2) return;
    if (!force && points.some((point) => point.x === 0 && point.y === 0)) return;
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const width = Math.max(120, maxX - minX + 120);
    const height = Math.max(120, maxY - minY + 120);
    const k = Math.min(1.8, Math.max(0.55, Math.min(900 / width, 520 / height)));
    const x = 500 - ((minX + maxX) / 2) * k;
    const y = 320 - ((minY + maxY) / 2) * k;
    fitted.current = true;
    select(svg).call(behavior.transform, zoomIdentity.translate(x, y).scale(k));
  };

  const pointInLayer = (event: React.PointerEvent) => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = layer.getScreenCTM();
    if (!matrix) return null;
    return point.matrixTransform(matrix.inverse());
  };

  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current) {
      const local = pointInLayer(event);
      const node = simRef.current?.nodes().find((item) => item.id === dragRef.current?.id);
      if (!local || !node) return;
      if (Math.hypot(event.clientX - dragRef.current.x, event.clientY - dragRef.current.y) > 4) dragRef.current.moved = true;
      node.fx = local.x;
      node.fy = local.y;
      simRef.current?.alpha(0.25).restart();
    }
  };

  const endPointer = () => {
    const drag = dragRef.current;
    if (drag && !drag.moved) choose(drag.id);
    if (drag) {
      const node = simRef.current?.nodes().find((item) => item.id === drag.id);
      if (node) {
        node.fx = node.x;
        node.fy = node.y;
      }
    }
    dragRef.current = null;
  };

  const choose = (id: string) => {
    const node = graphNode(id);
    if (selected === id && node?.href) {
      router.push(node.href);
      return;
    }
    setSelected(id);
  };

  const reset = () => {
    positions.current.clear();
    simRef.current?.nodes().forEach((node) => {
      node.fx = null;
      node.fy = null;
      node.x = 480 + (Math.random() - 0.5) * 120;
      node.y = 280 + (Math.random() - 0.5) * 120;
    });
    simRef.current?.alpha(0.9).restart();
    setQuery("");
    setFilter("All");
    setPathId(null);
    fitted.current = false;
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (svg && behavior) select(svg).call(behavior.transform, zoomIdentity.translate(40, 24));
    window.setTimeout(() => fitRef.current(true), 700);
  };

  const zoomBy = (factor: number) => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior) return;
    behavior.scaleBy(select(svg), factor);
  };

  const showPath = (id: string) => {
    const next = graphPaths.find((item) => item.id === id);
    if (!next) return;
    setPathId((current) => (current === id ? null : id));
    setFilter("All");
    setSelected(next.nodes[next.nodes.length - 1]);
    window.setTimeout(() => fitRef.current(true), 500);
  };

  return (
    <section className="site mt-16 md:mt-28" id="graph">
      <p className="kicker">03 — Engineering universe</p>
      <h2 className="display mt-4 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)]">The engineering universe — how everything connects.</h2>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        A map of languages, tools, projects, and roles. Every line is a relationship from the resume or a public repository.
      </p>
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the graph">
          {graphFilters.map((item) => (
            <button key={item} type="button" className={item === filter ? "btn !min-h-9" : "btn-ghost !min-h-9"} aria-pressed={item === filter} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="graph-search">Search nodes</label>
          <input
            id="graph-search"
            className="field w-full !py-2 sm:w-56"
            value={query}
            placeholder="Search nodes"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
              const index = nodes.findIndex((node) => node.id === selected);
              const next = nodes[(index + step + nodes.length) % nodes.length];
              if (next) setSelected(next.id);
            }}
          />
          <button type="button" className="btn-ghost !min-h-9" onClick={() => zoomBy(1.12)} aria-label="Zoom in">+</button>
          <button type="button" className="btn-ghost !min-h-9" onClick={() => zoomBy(0.9)} aria-label="Zoom out">−</button>
          <button type="button" className="btn-ghost !min-h-9" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Relationship paths">
        {graphPaths.map((item) => (
          <button key={item.id} type="button" className={item.id === pathId ? "btn !min-h-9" : "btn-ghost !min-h-9"} aria-pressed={item.id === pathId} onClick={() => showPath(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.12em] text-[var(--muted)]" aria-label="Node legend">
        {(["language", "technology", "tool", "project", "experience", "concept"] as const).map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: kindColor[kind] }} />
            {kind}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="graph relative border border-[var(--line)] bg-[var(--bg-2)] lg:col-span-8">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 640"
            className="h-[520px] w-full touch-none md:h-[640px]"
            role="application"
            aria-label="Engineering knowledge graph"
            onPointerMove={move}
            onPointerUp={endPointer}
            onPointerLeave={endPointer}
          >
            <g ref={layerRef} transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
              {links.map((link) => {
                const hot = pathEdge(path?.nodes, link.source, link.target) || Boolean(selected && !path && (link.source === selected || link.target === selected));
                return (
                  <line
                    key={`${link.source}|${link.target}`}
                    ref={(element) => {
                      const key = `${link.source}|${link.target}`;
                      if (element) linkRefs.current.set(key, element);
                      else linkRefs.current.delete(key);
                    }}
                    className={hot ? "graph-hot" : undefined}
                    stroke="var(--graph-line)"
                    strokeWidth={hot ? 1.8 : 1}
                    opacity={selected && !hot ? 0.15 : 1}
                  />
                );
              })}
              {nodes.map((node) => {
                const dim = Boolean(selected) && !related.has(node.id);
                const showLabel = !dim && (compact || hovered === node.id || related.has(node.id));
                return (
                  <g
                    key={node.id}
                    data-node={node.id}
                    ref={(element) => {
                      if (element) nodeRefs.current.set(node.id, element);
                      else nodeRefs.current.delete(node.id);
                    }}
                    opacity={dim ? 0.18 : 1}
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={-1}
                    aria-label={node.label}
                    aria-pressed={node.id === selected}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      dragRef.current = { id: node.id, moved: false, x: event.clientX, y: event.clientY };
                    }}
                    onPointerEnter={() => setHovered(node.id)}
                    onPointerLeave={() => setHovered((current) => (current === node.id ? null : current))}
                  >
                    <circle r={node.id === selected ? 16 : 11} fill={kindColor[node.kind]} stroke={node.id === selected ? "var(--ink)" : "transparent"} strokeWidth="2" />
                    {showLabel ? (
                      <text x="16" y="4" fill="var(--ink)" fontSize="13" fontFamily="var(--font-mono), monospace">
                        {node.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>
          <p className="sr-only" aria-live="polite">
            {hovered ? `${graphNode(hovered)?.label}. ${graphNode(hovered)?.summary}` : ""}
          </p>
        </div>
        <aside className="border border-[var(--line)] bg-[var(--bg-raise)] p-6 lg:col-span-4">
          {active ? (
            <>
              <p className="kicker">{active.kind}</p>
              <h3 className="mt-3 text-3xl tracking-[-0.04em]">{active.label}</h3>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">{active.summary}</p>
              <div className="mt-6">
                <p className="kicker">Connected</p>
                <ul className="mt-3 space-y-2">
                  {neighborsOf(active.id).map((id) => {
                    const node = graphNode(id);
                    if (!node) return null;
                    return (
                      <li key={id}>
                        <button type="button" className="text-left hover:text-[var(--accent-text)]" onClick={() => setSelected(id)}>
                          {node.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {active.href ? (
                <button type="button" className="btn mt-8" onClick={() => router.push(active.href || "/")}>
                  {active.kind === "project" ? "Open case study" : "Open page"}
                </button>
              ) : null}
              <p className="mt-4 text-sm text-[var(--faint)]">Arrow keys in search move the selection. Choose a project again to open it.</p>
            </>
          ) : (
            <p className="text-[var(--muted)]">Nothing matches that search.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
