"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { certificates } from "@/data/certificates";
import { CertificatePreview } from "@/components/certificate-preview";
import {
  searchUniverse,
  universeChildren,
  universeFilters,
  universeLinks,
  universeNeighbors,
  universeNode,
  universeNodes,
  universeParent,
  universeProgressive,
  universeTrail,
  universeVisible,
  type UniverseFilter,
  type UniverseNode,
} from "@/data/universe";

const UniverseScene = dynamic(() => import("@/components/universe-scene").then((mod) => mod.UniverseScene), {
  ssr: false,
  loading: () => <div className="universe-canvas grid place-items-center text-sm text-[#929ba5]">Opening the universe…</div>,
});

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function openedFrom(id?: string) {
  if (!id || !universeNode(id)) {
    return { selected: "vivek", expanded: [] as string[], pinned: [] as string[], trail: ["vivek"], panel: false };
  }
  const trail = universeTrail(id);
  return { selected: id, expanded: [id], pinned: trail, trail, panel: true };
}

function crumbName(node: UniverseNode) {
  if (node.category !== "domain") return node.name;
  return node.name
    .replace("Artificial Intelligence & Machine Learning", "AI & ML")
    .replace("Data Science & Analytics", "Data")
    .replace("Leadership & Operations", "Leadership")
    .replace("DevOps & Cloud", "DevOps")
    .replace("Industrial IoT", "IoT")
    .replace("UI/UX Design", "UI/UX")
    .replace("Software Engineering", "Software")
    .replace("Backend Development", "Backend")
    .replace("Education & Research", "Education");
}

function clampMenu(x: number, y: number, width: number, height: number) {
  const pad = 12;
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, window.innerWidth - width - pad)),
    y: Math.min(Math.max(pad, y), Math.max(pad, window.innerHeight - height - pad)),
  };
}

export function KnowledgeGraph({ focusId }: { focusId?: string }) {
  const reduce = useReducedMotion();
  const start = openedFrom(focusId);
  const [filter, setFilter] = useState<UniverseFilter>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(start.selected);
  const [expanded, setExpanded] = useState<string[]>(start.expanded);
  const [pinned, setPinned] = useState<string[]>(start.pinned);
  const [trail, setTrail] = useState<string[]>(start.trail);
  const [panelOpen, setPanelOpen] = useState(start.panel);
  const [panelMin, setPanelMin] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [zoomTick, setZoomTick] = useState<{ id: number; factor: number }>({ id: 0, factor: 1 });
  const [menu, setMenu] = useState<{ id: string; x: number; y: number; sheet: boolean } | null>(null);
  const [compact, setCompact] = useState(false);
  const [explore, setExplore] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(true);
  const [live, setLive] = useState(true);
  const suppressClick = useRef(false);

  useEffect(() => {
    setWebgl(webglAvailable());
    const media = window.matchMedia("(max-width: 899px)");
    const apply = () => setCompact(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!focusId || !universeNode(focusId)) return;
    const next = openedFrom(focusId);
    setSelected(next.selected);
    setExpanded(next.expanded);
    setPinned(next.pinned);
    setTrail(next.trail);
    setPanelOpen(true);
    setPanelMin(false);
    setFilter("All");
  }, [focusId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "Escape") {
        setMenu(null);
        setPanelOpen(false);
        if (document.fullscreenElement) void document.exitFullscreen();
        setExplore(false);
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        setTrail((current) => {
          if (current.length < 2) return current;
          const next = current.slice(0, -1);
          setSelected(next[next.length - 1] ?? "vivek");
          setPanelOpen(true);
          setPanelMin(false);
          return next;
        });
      }
    };
    const onFull = () => {
      if (!document.fullscreenElement) setExplore(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFull);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFull);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".universe-menu")) return;
      setMenu(null);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("touchstart", close);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("touchstart", close);
    };
  }, [menu]);

  const visible = useMemo(() => universeProgressive(expanded, pinned, filter), [expanded, filter, pinned]);
  const match = useMemo(() => universeVisible(filter), [filter]);
  const nodes = useMemo(() => Array.from(visible).map((id) => universeNode(id)).filter((node): node is UniverseNode => Boolean(node)), [visible]);
  const links = useMemo(
    () =>
      universeLinks.filter((link) => {
        if (!visible.has(link.source) || !visible.has(link.target)) return false;
        const source = universeNode(link.source);
        const target = universeNode(link.target);
        if (!source || !target) return false;
        const overview = (source.id === "vivek" || source.category === "domain") && (target.id === "vivek" || target.category === "domain");
        const parentLinked = universeParent(link.source) === link.target || universeParent(link.target) === link.source;
        const opened =
          (expanded.includes(link.source) && universeChildren(link.source).some((child) => child.id === link.target)) ||
          (expanded.includes(link.target) && universeChildren(link.target).some((child) => child.id === link.source));
        return overview || parentLinked || opened;
      }),
    [expanded, visible],
  );
  const active = universeNode(selected);
  const children = active ? universeChildren(active.id) : [];
  const childIds = new Set(children.map((node) => node.id));
  const neighbors = active ? universeNeighbors(active.id).filter((item) => visible.has(item.node.id) && !childIds.has(item.node.id)) : [];
  const gather = active ? universeChildren(active.id).map((node) => node.id).filter((id) => visible.has(id)) : [];
  const hot = useMemo(() => {
    if (!selected || !visible.has(selected)) return new Set<string>();
    return new Set([selected, ...universeNeighbors(selected).map((item) => item.node.id)].filter((id) => visible.has(id)));
  }, [selected, visible]);
  const results = searchUniverse(query);
  const sectionLabel = !active
    ? "Explore"
    : active.category === "project"
      ? "Technologies"
      : active.category === "skill"
        ? "Used in"
        : active.category === "company"
          ? "Roles"
          : active.category === "domain"
            ? "In this domain"
            : active.category === "research"
              ? "Topics & materials"
              : "Connected";
  const canExpand = Boolean(active && children.length > 0 && (!expanded.includes(active.id) || children.some((child) => !visible.has(child.id))));
  const canCollapse = Boolean(active && expanded.includes(active.id));

  const reveal = (id: string, depth: 1 | 2 = 1) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const node = universeNode(id);
    if (!node) {
      setSelected("");
      setPanelOpen(false);
      setMenu(null);
      return;
    }
    const path = universeTrail(id);
    const nextLevel = depth === 2 ? universeChildren(id).map((child) => child.id) : [];
    setSelected(id);
    setPanelOpen(true);
    setPanelMin(false);
    setMenu(null);
    setQuery("");
    setPinned(path);
    setExpanded((current) => Array.from(new Set(current.concat(id, nextLevel))));
    setTrail(path);
  };

  const goTo = (id: string) => {
    if (!universeNode(id)) return;
    const path = universeTrail(id);
    setSelected(id);
    setPanelOpen(true);
    setPanelMin(false);
    setMenu(null);
    setPinned(path);
    setTrail(path);
  };

  const collapseBranch = (id: string) => {
    const drop = new Set<string>();
    const walk = (current: string) => {
      universeChildren(current).forEach((child) => {
        if (drop.has(child.id)) return;
        drop.add(child.id);
        walk(child.id);
      });
    };
    walk(id);
    setExpanded((current) => current.filter((item) => item !== id && !drop.has(item)));
    setPinned((current) => current.filter((item) => !drop.has(item)));
    if (selected === id || drop.has(selected)) {
      setSelected(id);
      setTrail(universeTrail(id));
    }
    setMenu(null);
  };

  const expandSelected = () => {
    if (!active) return;
    reveal(active.id, 2);
  };

  const expandAll = () => {
    setExpanded(universeNodes.filter((node) => node.layer <= 2).map((node) => node.id));
    setMenu(null);
  };

  const collapseAll = () => {
    setExpanded([]);
    setPinned([]);
    setSelected("vivek");
    setTrail(["vivek"]);
    setPanelOpen(false);
    setPanelMin(false);
    setMenu(null);
    setQuery("");
    setResetSignal((value) => value + 1);
  };

  const reset = () => {
    setFilter("All");
    collapseAll();
  };

  const clearSelection = () => {
    setSelected("");
    setPanelOpen(false);
    setPanelMin(false);
    setMenu(null);
  };

  const openMenu = (id: string, x: number, y: number) => {
    suppressClick.current = true;
    if (compact) {
      setMenu({ id, x: 0, y: 0, sheet: true });
      return;
    }
    const point = clampMenu(x, y, 200, 280);
    setMenu({ id, ...point, sheet: false });
  };

  const toggleFullscreen = async () => {
    const node = shell.current;
    if (!node) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setExplore(false);
      return;
    }
    setExplore(true);
    if (node.requestFullscreen) await node.requestFullscreen();
  };

  const zoom = (factor: number) => setZoomTick((current) => ({ id: current.id + 1, factor }));

  return (
    <section className="site mt-16 md:mt-28" id="graph">
      <p className="kicker">03 — Universe</p>
      <div className="mt-4 max-w-3xl">
        <h2 className="text-4xl tracking-[-0.04em] md:text-6xl">Explore my professional universe.</h2>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          Discover the connections between my skills, projects, experiences and engineering journey.
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--faint)]">Click a node to explore its connections.</p>
      </div>

      <div className={explore ? "universe-shell is-explore mt-8" : "universe-shell mt-8"} ref={shell} onContextMenu={(event) => event.preventDefault()}>
        <div className="universe-chrome">
          <div className="universe-toolbar-row">
            <label className="universe-search">
              <span className="sr-only">Search the universe</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, skills, certificates…"
                aria-label="Search the universe"
              />
              {results.length > 0 ? (
                <ul>
                  {results.map((node) => (
                    <li key={node.id}>
                      <button type="button" onClick={() => reveal(node.id)}>
                        <span>{node.name}</span>
                        <small>{node.category}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </label>
            <div className="universe-controls" role="toolbar" aria-label="Graph controls">
              <button type="button" title="Back to parent" aria-label="Back to parent" onClick={() => {
                const parent = trail[trail.length - 2];
                if (parent) goTo(parent);
              }} disabled={trail.length < 2}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
              </button>
              <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoom(0.82)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M7 3v8M3 7h8" /><circle cx="7" cy="7" r="5.2" /></svg>
              </button>
              <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoom(1.22)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 7h8" /><circle cx="7" cy="7" r="5.2" /></svg>
              </button>
              <button type="button" title="Expand selected" aria-label="Expand selected" onClick={expandSelected} disabled={!canExpand}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
              </button>
              <button type="button" title="Collapse branch" aria-label="Collapse branch" onClick={() => active && collapseBranch(active.id)} disabled={!canCollapse}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>
              </button>
              <button type="button" title="Expand all" aria-label="Expand all" onClick={expandAll}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4h8v8H4zM1 8h2M13 8h2M8 1v2M8 13v2" /></svg>
              </button>
              <button type="button" title="Collapse all" aria-label="Collapse all" onClick={collapseAll}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5h10M3 11h10" /></svg>
              </button>
              <button type="button" title={autoRotate ? "Stop rotation" : "Start rotation"} aria-label={autoRotate ? "Stop rotation" : "Start rotation"} aria-pressed={autoRotate} onClick={() => setAutoRotate((value) => !value)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.5" /><path d="M12 2v3.5H8.5" /></svg>
              </button>
              <button type="button" title="Reset view" aria-label="Reset view" onClick={reset}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.2-3.2" /><path d="M3 2.5V6h3.5" /></svg>
              </button>
              <button type="button" title="Clear selection" aria-label="Clear selection" onClick={clearSelection} disabled={!selected}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
              <button type="button" title={explore ? "Exit fullscreen" : "Fullscreen"} aria-label={explore ? "Exit fullscreen" : "Enter fullscreen"} aria-pressed={explore} onClick={() => void toggleFullscreen()}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3" /></svg>
              </button>
            </div>
          </div>
          <div className="universe-filters" role="toolbar" aria-label="Filter the universe">
            {universeFilters.map((item) => (
              <button key={item} type="button" className={item === filter ? "is-on" : ""} onClick={() => setFilter(item)} aria-pressed={item === filter}>
                {item}
              </button>
            ))}
          </div>
          <nav className="universe-crumbs" aria-label="Graph path">
            {trail.map((id, index) => {
              const node = universeNode(id);
              if (!node) return null;
              return (
                <span key={id}>
                  {index > 0 ? <span aria-hidden="true"> / </span> : null}
                  <button type="button" onClick={() => goTo(id)} aria-current={id === selected ? "true" : undefined}>
                    {crumbName(node)}
                  </button>
                </span>
              );
            })}
          </nav>
        </div>

        <div className="universe-viewport" ref={viewport}>
          {webgl ? (
            <UniverseScene
              nodes={nodes}
              links={links}
              selected={selected}
              hot={hot}
              match={match}
              filterActive={filter !== "All"}
              gather={gather}
              path={trail}
              reduce={Boolean(reduce)}
              compact={compact}
              panelOpen={panelOpen && !panelMin}
              autoRotate={autoRotate}
              resetSignal={resetSignal}
              zoomTick={zoomTick}
              frameloop={live && !reduce ? "always" : "demand"}
              onSelect={(id) => reveal(id)}
              onOpen={(id) => reveal(id, 2)}
              onMenu={openMenu}
              onHover={() => undefined}
            />
          ) : (
            <ul className="universe-fallback">
              {nodes.map((node) => (
                <li key={node.id}>
                  <button type="button" onClick={() => reveal(node.id)}>
                    {node.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {expanded.length === 0 && pinned.length === 0 && filter === "All" ? (
            <p className="universe-hint">Drag to look · Scroll to zoom · Click a domain to open it</p>
          ) : null}

          {panelOpen && active ? (
            <aside className={panelMin ? "universe-panel is-min" : "universe-panel"} aria-live="polite">
              <div className="universe-panel-head">
                <p className="kicker">{active.category}</p>
                <div className="universe-panel-actions">
                  <button type="button" onClick={() => setPanelMin((value) => !value)} aria-label={panelMin ? "Expand details" : "Minimize details"}>
                    {panelMin ? "Open" : "Min"}
                  </button>
                  <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close details">
                    Close
                  </button>
                </div>
              </div>
              {panelMin ? <h3>{active.name}</h3> : (
                <>
                  <h3>{active.name}</h3>
                  <p>{active.summary}</p>
                  {active.details.slice(0, 4).map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                  {active.category === "certificate"
                    ? (() => {
                        const cert = certificates.find((item) => item.id === active.id);
                        if (!cert) return null;
                        return (
                          <CertificatePreview
                            href={cert.href}
                            title={cert.name}
                            fileType={cert.fileType}
                            variant="universe"
                          />
                        );
                      })()
                    : null}
                  {children.length > 0 ? (
                    <div>
                      <p className="kicker">{sectionLabel}</p>
                      <ul>
                        {children.slice(0, 16).map((node) => (
                          <li key={node.id}>
                            <button type="button" onClick={() => reveal(node.id)}>
                              {node.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {neighbors.length > 0 ? (
                    <div>
                      <p className="kicker">Also connected</p>
                      <ul>
                        {neighbors.slice(0, 6).map((item) => (
                          <li key={item.node.id}>
                            <button type="button" onClick={() => reveal(item.node.id)}>
                              {item.node.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {active.actions.length > 0 ? (
                    <div className="universe-actions">
                      {active.actions.map((action) => (
                        <a key={action.href + action.label} className="btn" href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined} download={action.download ? "" : undefined}>
                          {action.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {universeParent(active.id) ? (
                    <button
                      type="button"
                      className="universe-back"
                      onClick={() => {
                        const parent = universeParent(active.id);
                        if (parent) goTo(parent);
                      }}
                    >
                      Back to {universeNode(universeParent(active.id) ?? "")?.name}
                    </button>
                  ) : null}
                </>
              )}
            </aside>
          ) : null}
        </div>

        {menu ? (
          <div
            className={menu.sheet ? "universe-menu is-sheet" : "universe-menu"}
            style={menu.sheet ? undefined : { left: menu.x, top: menu.y }}
            role="menu"
          >
            <button type="button" onClick={() => reveal(menu.id, 2)}>Expand</button>
            <button type="button" onClick={() => collapseBranch(menu.id)}>Collapse</button>
            <button type="button" onClick={expandAll}>Expand all</button>
            <button type="button" onClick={collapseAll}>Collapse all</button>
            <button
              type="button"
              onClick={() => {
                const parent = universeParent(menu.id);
                if (parent) goTo(parent);
                else setMenu(null);
              }}
            >
              Back to parent
            </button>
            <button
              type="button"
              onClick={() => {
                goTo(menu.id);
                setMenu(null);
              }}
            >
              View details
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
