"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroCore } from "@/components/hero-core";

const CoreScene = dynamic(() => import("@/components/core-scene").then((mod) => mod.CoreScene), { ssr: false });

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CoreVisual({ variant = "hero" }: { variant?: "hero" | "aside" }) {
  const root = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [mode, setMode] = useState<"webgl" | "fallback" | "pending">("pending");
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      setReduced(motion.matches);
      setMobile(compact.matches);
      setMode(webglAvailable() ? "webgl" : "fallback");
    };
    apply();
    motion.addEventListener("change", apply);
    compact.addEventListener("change", apply);
    return () => {
      motion.removeEventListener("change", apply);
      compact.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (variant !== "hero") return;
    const update = () => {
      const element = root.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      scrollRef.current = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [variant]);

  return (
    <div ref={root} className={variant === "hero" ? "hero-core" : "core-aside"} aria-hidden="true">
      {mode === "webgl" ? <CoreScene mobile={mobile} reduced={reduced} linked={variant === "hero"} scrollRef={scrollRef} /> : <HeroCore />}
    </div>
  );
}
