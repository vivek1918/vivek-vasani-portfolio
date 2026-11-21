"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useSite } from "@/components/providers";

function Specks({ count, color }: { count: number; color: string }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 1.7 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial color={color} size={0.03} sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

function Core({
  mobile,
  reduced,
  linked,
  scrollRef,
}: {
  mobile: boolean;
  reduced: boolean;
  linked: boolean;
  scrollRef: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { theme } = useSite();
  const light = theme === "light";

  useFrame((state, delta) => {
    const groupNode = group.current;
    if (!groupNode) return;
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;
    const scroll = linked && !reduced ? scrollRef.current : 0;
    const float = reduced || !linked ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    groupNode.position.y = float - scroll * 0.22;
    const speed = reduced ? 0 : 0.18 + scroll * 1.05;
    if (ringA.current) ringA.current.rotation.z += delta * speed;
    if (ringB.current) ringB.current.rotation.x += delta * speed * 0.7;
    const targetY = pointer.current.x * 0.2 + scroll * 0.85;
    const targetX = pointer.current.y * 0.1;
    const step = reduced ? 1 : Math.min(1, delta * 1.4);
    groupNode.rotation.y += (targetY - groupNode.rotation.y) * step;
    groupNode.rotation.x += (targetX - groupNode.rotation.x) * step;
    const depth = (mobile ? 5.4 : 4.6) + scroll * 1.15;
    const lift = -scroll * 0.4;
    state.camera.position.z += (depth - state.camera.position.z) * 0.08;
    state.camera.position.y += (lift - state.camera.position.y) * 0.08;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <hemisphereLight args={[light ? "#f4f1ea" : "#1a222c", light ? "#d7ddd0" : "#07090c", light ? 0.9 : 0.35]} />
      <ambientLight intensity={light ? 0.55 : 0.22} />
      <directionalLight position={[3, 4, 5]} intensity={light ? 1.35 : 0.7} />
      <pointLight position={[-2.4, 1.2, 2]} color="#b6f36b" intensity={light ? 6 : 12} distance={8} />
      <pointLight position={[2.2, -1.4, 1.5]} color="#56d9e8" intensity={light ? 2 : 5} distance={7} />
      <Float speed={1} rotationIntensity={reduced || linked ? 0 : 0.2} floatIntensity={reduced || linked ? 0 : 0.35}>
      <group ref={group}>
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial color={light ? "#d7ddd4" : "#8d98a3"} metalness={0.86} roughness={0.22} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.12, 1]} />
          <meshBasicMaterial color="#b6f36b" wireframe transparent opacity={light ? 0.45 : 0.7} />
        </mesh>
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0.15]}>
          <torusGeometry args={[1.62, 0.012, 12, 80]} />
          <meshBasicMaterial color="#b6f36b" transparent opacity={light ? 0.55 : 0.8} />
        </mesh>
        <mesh ref={ringB} rotation={[0.4, 0.8, Math.PI / 3]}>
          <torusGeometry args={[1.95, 0.008, 12, 80]} />
          <meshBasicMaterial color="#56d9e8" transparent opacity={light ? 0.35 : 0.55} />
        </mesh>
        <Specks count={mobile ? 14 : 36} color={light ? "#3d4a3a" : "#b6f36b"} />
      </group>
      </Float>
    </>
  );
}

export function CoreScene({
  mobile,
  reduced,
  linked,
  scrollRef,
}: {
  mobile: boolean;
  reduced: boolean;
  linked: boolean;
  scrollRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, mobile ? 5.4 : 4.6], fov: 42 }}
      dpr={[1, mobile ? 1.25 : 1.6]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Core mobile={mobile} reduced={reduced} linked={linked} scrollRef={scrollRef} />
    </Canvas>
  );
}
