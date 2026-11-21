"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = cursor.current;
    if (!fine || reduce || !node) return;

    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = window.requestAnimationFrame(loop);
    };

    const buttons = () => document.querySelectorAll<HTMLElement>(".btn");
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const interactive = event.target instanceof Element ? event.target.closest("a, button") : null;
      const label = interactive?.getAttribute("data-cursor") || "";
      node.classList.toggle("hot", Boolean(label));
      node.classList.toggle("quiet", !interactive);
      const text = node.querySelector("b");
      if (text) text.textContent = label;
      buttons().forEach((button) => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const reach = Math.max(rect.width, rect.height) * 0.85;
        if (Math.hypot(dx, dy) < reach) {
          button.style.setProperty("--mx", `${dx * 0.18}px`);
          button.style.setProperty("--my", `${dy * 0.18}px`);
        } else {
          button.style.removeProperty("--mx");
          button.style.removeProperty("--my");
        }
      });
    };

    const leave = () => {
      node.style.opacity = "0";
      buttons().forEach((button) => {
        button.style.removeProperty("--mx");
        button.style.removeProperty("--my");
      });
    };
    const enter = () => {
      node.style.opacity = "1";
    };

    frame = window.requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div ref={cursor} className="cursor" aria-hidden="true">
      <i />
      <b />
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      node.style.transform = `scaleX(${progress})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={bar} className="progress w-full scale-x-0" />;
}
