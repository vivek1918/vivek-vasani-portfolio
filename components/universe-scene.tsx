"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, InstancedMesh, Object3D, Points, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Mesh } from "three";
import type { UniverseLink, UniverseNode } from "@/data/universe";
import { universeParent } from "@/data/universe";

const colors: Record<UniverseNode["category"], string> = {
  identity: "#b6f36b",
  domain: "#56d9e8",
  company: "#d7c4a3",
  experience: "#e6d2b5",
  project: "#a8d68a",
  skill: "#7eb6ff",
  education: "#56d9e8",
  document: "#c4b5e8",
  certificate: "#d6c7f2",
  presence: "#56d9e8",
};

const shortName: Record<string, string> = {
  "domain-software": "Software",
  "domain-backend": "Backend",
  "domain-aiml": "AI & ML",
  "domain-devops": "DevOps",
  "domain-data": "Data",
  "domain-iot": "IoT",
  "domain-uiux": "UI/UX",
  "domain-leadership": "Leadership",
  "domain-education": "Education",
};

type Vec = [number, number, number];

function fanSlot(parent: Vec, index: number, count: number): Vec {
  const length = Math.hypot(parent[0], parent[2]) || 1;
  const ox = parent[0] / length;
  const oz = parent[2] / length;
  const column = index - (count - 1) / 2;
  const dist = 2.15 + (Math.abs(column) > 3 ? 0.8 : 0);
  return [parent[0] + ox * dist - oz * column * 0.66, parent[1] + ((index % 5) - 2) * 0.36, parent[2] + oz * dist + ox * column * 0.66];
}

function displayOf(node: UniverseNode, selected: UniverseNode | undefined, gather: string[]) {
  const home = node.position;
  if (!selected || node.id === selected.id || node.layer <= 2 || !gather.includes(node.id)) return home;
  const dx = home[0] - selected.position[0];
  const dy = home[1] - selected.position[1];
  const dz = home[2] - selected.position[2];
  if (Math.hypot(dx, dy, dz) < 3.8) return home;
  const ordered = gather.filter((id) => id !== selected.id);
  const index = Math.max(0, ordered.indexOf(node.id));
  return fanSlot(selected.position, index, ordered.length);
}

function edgeStyle(link: UniverseLink, source: UniverseNode, target: UniverseNode, hot: boolean) {
  const categories = new Set([source.category, target.category]);
  let color = "#245c68";
  if (categories.has("identity")) color = "#b6f36b";
  else if (link.type === "organization" || (categories.has("experience") && categories.has("company"))) color = "#d7c4a3";
  else if (categories.has("document") || categories.has("certificate") || link.type === "document" || link.type === "credential") color = "#e6d3a1";
  else if (categories.has("project") && categories.has("skill")) color = "#7eb6ff";
  else if (categories.has("domain") && categories.has("project")) color = "#56d9e8";
  else if (categories.has("domain")) color = "#3f8f9c";
  if (hot) color = categories.has("skill") && categories.has("project") ? "#b7dcff" : "#d8ff9a";
  return color;
}

function Edges({
  nodes,
  links,
  hot,
  placed,
  reduce,
}: {
  nodes: UniverseNode[];
  links: UniverseLink[];
  hot: Set<string>;
  placed: Map<string, Vec>;
  reduce: boolean;
}) {
  const geometry = useRef<BufferGeometry>(null);
  const born = useRef(new Map<string, number>());
  const payload = useMemo(() => {
    const positions = new Float32Array(Math.max(links.length, 1) * 6);
    const tint = new Float32Array(Math.max(links.length, 1) * 6);
    return { positions, tint };
  }, [links]);

  useFrame(() => {
    const attribute = geometry.current?.getAttribute("position") as BufferAttribute | undefined;
    const colorAttribute = geometry.current?.getAttribute("color") as BufferAttribute | undefined;
    if (!attribute || !colorAttribute) return;
    const byId = new Map(nodes.map((node) => [node.id, node]));
    links.forEach((link, index) => {
      const source = byId.get(link.source);
      const target = byId.get(link.target);
      const from = placed.get(link.source);
      const to = placed.get(link.target);
      if (!source || !target || !from || !to) return;
      const key = `${link.source}|${link.target}|${link.type}`;
      if (!born.current.has(key)) born.current.set(key, performance.now() + index * 45);
      const elapsed = performance.now() - (born.current.get(key) ?? 0);
      const progress = reduce ? 1 : Math.min(1, elapsed / 680);
      const ease = 1 - (1 - progress) ** 3;
      const lit = hot.has(link.source) && hot.has(link.target);
      const pulse = lit ? 1 : 0.28 + Math.sin(performance.now() / 900 + index) * 0.05;
      const color = new Color(edgeStyle(link, source, target, lit));
      color.multiplyScalar(pulse);
      const end: Vec = [from[0] + (to[0] - from[0]) * ease, from[1] + (to[1] - from[1]) * ease, from[2] + (to[2] - from[2]) * ease];
      payload.positions.set([...from, ...end], index * 6);
      payload.tint.set([...color.toArray(), ...color.toArray()], index * 6);
    });
    attribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[payload.positions, 3]} count={payload.positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[payload.tint, 3]} count={payload.tint.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.9} />
    </lineSegments>
  );
}

function Flow({
  links,
  hot,
  path,
  placed,
  reduce,
  compact,
}: {
  links: UniverseLink[];
  hot: Set<string>;
  path: Set<string>;
  placed: Map<string, Vec>;
  reduce: boolean;
  compact: boolean;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const active = links.filter((link) => hot.has(link.source) && hot.has(link.target)).slice(0, compact ? 12 : 28);
  useFrame(({ clock }) => {
    const points = mesh.current;
    if (!points) return;
    points.count = reduce ? 0 : active.length;
    if (reduce) return;
    active.forEach((link, index) => {
      const from = placed.get(link.source);
      const to = placed.get(link.target);
      if (!from || !to) return;
      const alongPath = path.has(link.source) && path.has(link.target);
      const travel = (clock.elapsedTime * (alongPath ? 0.42 : 0.18) + index * 0.13) % 1;
      dummy.position.set(from[0] + (to[0] - from[0]) * travel, from[1] + (to[1] - from[1]) * travel, from[2] + (to[2] - from[2]) * travel);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      points.setMatrixAt(index, dummy.matrix);
    });
    points.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 28]}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#e9ffc4" transparent opacity={0.9} />
    </instancedMesh>
  );
}

function GraphNode({
  node,
  display,
  origin,
  selected,
  hovered,
  hot,
  dim,
  compact,
  showLabel,
  reduce,
  onSelect,
  onOpen,
  onMenu,
  onHover,
}: {
  node: UniverseNode;
  display: Vec;
  origin: Vec;
  selected: boolean;
  hovered: boolean;
  hot: boolean;
  dim: boolean;
  compact: boolean;
  showLabel: boolean;
  reduce: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMenu: (id: string, x: number, y: number) => void;
  onHover: (id: string) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const current = useRef(new Vector3(...origin));
  const target = useRef(new Vector3(...display));
  const hold = useRef(0);
  const born = useRef(performance.now() + (node.category === "identity" ? 0 : node.category === "domain" ? 220 + Math.abs(node.position[0]) * 90 : 80));
  const base = node.category === "identity" ? 0.62 : node.category === "domain" ? 0.38 : node.category === "project" ? 0.2 : node.layer === 2 ? 0.16 : 0.1;
  const size = base * (compact ? 1.12 : 1);
  const major = node.category === "identity" || node.category === "domain";
  useFrame(({ clock }, delta) => {
    target.current.set(display[0], display[1] + (reduce || selected ? 0 : Math.sin(clock.elapsedTime * 0.7 + node.importance) * 0.045), display[2]);
    const next = current.current.lerp(target.current, reduce ? 1 : 1 - Math.exp(-delta * 5.5));
    const appear = reduce ? 1 : Math.min(1, Math.max(0, performance.now() - born.current) / 640);
    const scale = (0.15 + 0.85 * (1 - (1 - appear) ** 3)) * (hovered ? 1.16 : selected ? 1.08 : 1);
    if (mesh.current) {
      mesh.current.position.copy(next);
      mesh.current.scale.setScalar(scale);
      const pulse = selected ? 1.7 + Math.sin(clock.elapsedTime * 3.4) * 0.2 : 0.7 + Math.sin(clock.elapsedTime * 1.2 + node.importance) * 0.08;
      const material = mesh.current.material as unknown as { emissiveIntensity: number; opacity: number };
      material.emissiveIntensity = dim ? 0.04 : pulse;
      material.opacity = dim ? 0.18 : appear;
    }
    if (halo.current) {
      halo.current.position.copy(next);
      halo.current.scale.setScalar(scale);
      const material = halo.current.material as { opacity: number };
      material.opacity = dim ? 0.02 : selected ? 0.34 : major ? 0.14 : hovered ? 0.2 : 0.05;
    }
    if (ring.current) {
      ring.current.position.copy(next);
      ring.current.rotation.z += delta * (selected ? 0.6 : 0.15);
      const material = ring.current.material as { opacity: number };
      material.opacity = dim ? 0.05 : 0.45 + (selected ? 0.35 : 0);
    }
  });
  return (
    <group>
      <mesh
        ref={mesh}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onOpen(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover("");
          document.body.style.cursor = "";
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
          event.nativeEvent.preventDefault();
          onMenu(node.id, event.nativeEvent.clientX, event.nativeEvent.clientY);
        }}
        onPointerDown={(event) => {
          window.clearTimeout(hold.current);
          const x = event.nativeEvent.clientX;
          const y = event.nativeEvent.clientY;
          hold.current = window.setTimeout(() => onMenu(node.id, x, y), 640);
        }}
        onPointerUp={() => window.clearTimeout(hold.current)}
      >
        <sphereGeometry args={[size, selected ? 24 : 16, selected ? 24 : 16]} />
        <meshStandardMaterial color={colors[node.category]} emissive={colors[node.category]} emissiveIntensity={0.45} transparent />
        {showLabel || selected || hovered ? (
          <Html position={[0, size + 0.16, 0]} center distanceFactor={compact ? 14 : 12} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
            <span className={node.category === "identity" ? "universe-label is-core" : "universe-label"}>{shortName[node.id] ?? node.name}</span>
          </Html>
        ) : null}
      </mesh>
      <mesh ref={halo} raycast={() => null}>
        <sphereGeometry args={[size * (major ? 2.4 : 1.8), 16, 16]} />
        <meshBasicMaterial color={colors[node.category]} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
      </mesh>
      {major ? (
        <mesh ref={ring} raycast={() => null} rotation={[Math.PI / 2.2, 0.4, 0]}>
          <torusGeometry args={[size * 1.85, major && node.category === "identity" ? 0.018 : 0.01, 8, 56]} />
          <meshBasicMaterial color={colors[node.category]} transparent opacity={0.4} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      ) : null}
    </group>
  );
}

function focusPoints(selected: string, nodes: UniverseNode[], placed: Map<string, Vec>) {
  const focus = nodes.find((node) => node.id === selected);
  const overview = !focus || focus.id === "vivek";
  const ids = new Set<string>();
  if (overview) nodes.forEach((node) => ids.add(node.id));
  else {
    ids.add(focus.id);
    const parent = universeParent(focus.id);
    if (parent && nodes.some((node) => node.id === parent)) ids.add(parent);
    nodes.forEach((node) => {
      if (universeParent(node.id) === focus.id) ids.add(node.id);
    });
  }
  const points = nodes.filter((node) => ids.has(node.id)).map((node) => new Vector3(...(placed.get(node.id) ?? node.position)));
  return points.length ? points : [new Vector3(0, 0.2, 0)];
}

function viewFrame(points: Vector3[], panel: "none" | "side" | "sheet", fov: number, aspect: number) {
  const back = new Vector3(1.15, 0.48, 1).normalize();
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), back);
  if (right.lengthSq() < 1e-4) right.set(1, 0, 0);
  right.normalize();
  const up = new Vector3().crossVectors(back, right).normalize();
  const center = points.reduce((sum, point) => sum.add(point), new Vector3()).multiplyScalar(1 / points.length);
  const vTan = Math.tan(fov / 2);
  const hTan = vTan * aspect;
  const limits = { minX: -0.9, maxX: 0.9, minY: -0.9, maxY: 0.6 };
  const projected = (distance: number) => {
    const cam = center.clone().add(back.clone().multiplyScalar(distance));
    return points.map((point) => {
      const rel = point.clone().sub(cam);
      const depth = Math.max(0.2, -rel.dot(back));
      return { x: rel.dot(right) / (depth * hTan), y: rel.dot(up) / (depth * vTan) };
    });
  };
  let low = 3.4;
  let high = 42;
  for (let step = 0; step < 16; step += 1) {
    const mid = (low + high) / 2;
    const inside = projected(mid).every((value) => value.x >= limits.minX && value.x <= limits.maxX && value.y >= limits.minY && value.y <= limits.maxY);
    if (inside) high = mid;
    else low = mid;
  }
  const seen = projected(high);
  const midX = (Math.min(...seen.map((value) => value.x)) + Math.max(...seen.map((value) => value.x))) / 2;
  const midY = (Math.min(...seen.map((value) => value.y)) + Math.max(...seen.map((value) => value.y))) / 2;
  const goalX = panel === "side" ? -0.16 : 0;
  const goalY = panel === "sheet" ? 0.22 : (limits.minY + limits.maxY) / 2;
  const target = center
    .clone()
    .add(right.clone().multiplyScalar(-(goalX - midX) * high * hTan))
    .add(up.clone().multiplyScalar(-(goalY - midY) * high * vTan));
  return { target, position: target.clone().add(back.clone().multiplyScalar(high)) };
}

function Rig({
  selected,
  nodes,
  placed,
  reduce,
  resetSignal,
  compact,
  panelOpen,
}: {
  selected: string;
  nodes: UniverseNode[];
  placed: Map<string, Vec>;
  reduce: boolean;
  resetSignal: number;
  compact: boolean;
  panelOpen: boolean;
}) {
  const { camera, size } = useThree();
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const signature = useRef("");
  const fromPos = useRef(new Vector3());
  const toPos = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  const toTarget = useRef(new Vector3());
  const started = useRef(0);
  const running = useRef(false);
  const key = `${selected}|${resetSignal}|${nodes.map((node) => node.id).join(",")}|${compact}|${panelOpen}|${Math.round(size.width / 8)}x${Math.round(size.height / 8)}`;
  useFrame(() => {
    if (!controls) return;
    if (signature.current !== key) {
      signature.current = key;
      const aspect = size.width / Math.max(size.height, 1);
      const fov = ((camera as { fov?: number }).fov ?? 42) * (Math.PI / 180);
      const framed = viewFrame(focusPoints(selected, nodes, placed), panelOpen ? (compact ? "sheet" : "side") : "none", fov, aspect);
      fromPos.current.copy(camera.position);
      fromTarget.current.copy(controls.target);
      toTarget.current.copy(framed.target);
      toPos.current.copy(framed.position);
      started.current = performance.now();
      running.current = true;
    }
    if (!running.current) return;
    const progress = reduce ? 1 : Math.min(1, (performance.now() - started.current) / 1100);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
    camera.position.lerpVectors(fromPos.current, toPos.current, eased);
    controls.target.lerpVectors(fromTarget.current, toTarget.current, eased);
    controls.update();
    if (progress >= 1) running.current = false;
  });
  return null;
}

function Dust({ reduce, compact }: { reduce: boolean; compact: boolean }) {
  const near = useRef<Points>(null);
  const far = useRef<Points>(null);
  const nearCount = compact ? 90 : 220;
  const farCount = compact ? 70 : 180;
  const field = (count: number, spread: number) => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = spread + ((index * 47) % 90) / 8;
      const theta = ((index * 19) % 360) * (Math.PI / 180);
      values[index * 3] = Math.cos(theta) * radius;
      values[index * 3 + 1] = ((index * 13) % 100) / 8 - 6;
      values[index * 3 + 2] = Math.sin(theta) * radius;
    }
    return values;
  };
  const nearPositions = useMemo(() => field(nearCount, 4), [nearCount]);
  const farPositions = useMemo(() => field(farCount, 12), [farCount]);
  useFrame((_, delta) => {
    if (reduce) return;
    if (near.current) near.current.rotation.y += delta * 0.018;
    if (far.current) far.current.rotation.y -= delta * 0.006;
  });
  return (
    <group>
      <points ref={near}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearPositions, 3]} count={nearPositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#d7ffb0" size={0.028} transparent opacity={0.45} depthWrite={false} />
      </points>
      <points ref={far}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farPositions, 3]} count={farPositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#56d9e8" size={0.018} transparent opacity={0.28} depthWrite={false} />
      </points>
    </group>
  );
}

function Stage({
  nodes,
  links,
  selected,
  hot,
  match,
  filterActive,
  gather,
  path,
  hovered,
  reduce,
  compact,
  panelOpen,
  resetSignal,
  onSelect,
  onOpen,
  onMenu,
  onHover,
}: {
  nodes: UniverseNode[];
  links: UniverseLink[];
  selected: string;
  hot: Set<string>;
  match: Set<string>;
  filterActive: boolean;
  gather: string[];
  path: string[];
  hovered: string;
  reduce: boolean;
  compact: boolean;
  panelOpen: boolean;
  resetSignal: number;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMenu: (id: string, x: number, y: number) => void;
  onHover: (id: string) => void;
}) {
  const selectedNode = nodes.find((node) => node.id === selected);
  const placed = useMemo(() => {
    const map = new Map<string, Vec>();
    nodes.forEach((node) => map.set(node.id, displayOf(node, selectedNode, gather)));
    return map;
  }, [gather, nodes, selectedNode]);
  const hoveredLabels = gather.length <= (compact ? 4 : 8);
  const lit = new Set<string>();
  const route = new Set<string>();
  hot.forEach((id) => lit.add(id));
  path.forEach((id) => {
    lit.add(id);
    route.add(id);
  });
  return (
    <>
      <color attach="background" args={["#07090c"]} />
      <fog attach="fog" args={["#07090c", 18, 46]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[4, 6, 5]} color="#b6f36b" intensity={22} distance={24} />
      <pointLight position={[-6, 3, -3]} color="#56d9e8" intensity={16} distance={22} />
      <Dust reduce={reduce} compact={compact} />
      <Edges nodes={nodes} links={links} hot={lit} placed={placed} reduce={reduce} />
      {reduce ? null : <Flow links={links} hot={lit} path={route} placed={placed} reduce={reduce} compact={compact} />}
      {nodes.map((node) => {
        const parent = universeParent(node.id);
        const parentNode = nodes.find((item) => item.id === parent);
        const origin = parentNode?.position ?? node.position;
        const quiet = hot.size > 0 && !hot.has(node.id) && !path.includes(node.id);
        const filtered = filterActive && !match.has(node.id) && node.category !== "identity";
        return (
          <GraphNode
            key={node.id}
            node={node}
            display={placed.get(node.id) ?? node.position}
            origin={origin}
            selected={node.id === selected}
            hovered={node.id === hovered}
            hot={hot.has(node.id)}
            dim={quiet || filtered}
            compact={compact}
            showLabel={node.layer <= 1 || (hoveredLabels && gather.includes(node.id))}
            reduce={reduce}
            onSelect={onSelect}
            onOpen={onOpen}
            onMenu={onMenu}
            onHover={onHover}
          />
        );
      })}
      <Rig selected={selected} nodes={nodes} placed={placed} reduce={reduce} resetSignal={resetSignal} compact={compact} panelOpen={panelOpen} />
    </>
  );
}

export function UniverseScene({
  nodes,
  links,
  selected,
  hot,
  match,
  filterActive,
  gather,
  path,
  reduce,
  compact,
  panelOpen,
  autoRotate,
  resetSignal,
  frameloop,
  onSelect,
  onOpen,
  onMenu,
  onHover,
}: {
  nodes: UniverseNode[];
  links: UniverseLink[];
  selected: string;
  hot: Set<string>;
  match: Set<string>;
  filterActive: boolean;
  gather: string[];
  path: string[];
  reduce: boolean;
  compact: boolean;
  panelOpen: boolean;
  autoRotate: boolean;
  resetSignal: number;
  frameloop: "always" | "demand";
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMenu: (id: string, x: number, y: number) => void;
  onHover: (id: string) => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [hovered, setHovered] = useState("");
  return (
    <Canvas
      className="universe-canvas"
      camera={{ position: [1.6, 3.4, 8.2], fov: 42, near: 0.1, far: 80 }}
      frameloop={frameloop}
      dpr={compact ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: !compact, powerPreference: "high-performance", alpha: false }}
      onPointerMissed={() => onSelect("")}
    >
      <Stage
        nodes={nodes}
        links={links}
        selected={selected}
        hot={hovered ? new Set(Array.from(hot).concat(hovered)) : hot}
        match={match}
        filterActive={filterActive}
        gather={gather}
        path={path}
        hovered={hovered}
        reduce={reduce}
        compact={compact}
        panelOpen={panelOpen}
        resetSignal={resetSignal}
        onSelect={onSelect}
        onOpen={onOpen}
        onMenu={onMenu}
        onHover={(id) => {
          setHovered(id);
          onHover(id);
        }}
      />
      <OrbitControls
        ref={controls}
        enablePan
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !reduce && (!selected || selected === "vivek")}
        autoRotateSpeed={0.28}
        minDistance={2.4}
        maxDistance={42}
        makeDefault
      />
    </Canvas>
  );
}
