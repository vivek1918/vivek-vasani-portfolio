"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number };

export function HeroCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    const pointer = { x: 0, y: 0 };
    let scroll = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (x: number, y: number, z: number, ry: number, rx: number): Point => {
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const depth = 3.1 / (3.1 + z2);
      return { x: x1 * depth, y: y2 * depth, z: z2 };
    };

    const stroke = (points: Point[], color: string, originX: number, originY: number, radius: number) => {
      context.beginPath();
      points.forEach((point, index) => {
        const x = originX + point.x * radius;
        const y = originY + point.y * radius;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.strokeStyle = color;
      context.stroke();
    };

    const draw = (time: number) => {
      if (!running) return;
      const mobile = width < 640;
      const meridians = mobile ? 8 : 13;
      const parallels = mobile ? 5 : 8;
      const nodes = mobile ? 8 : 16;
      const t = reduce ? 0.6 : time / 1000;
      const ry = t * 0.25 + pointer.x * 0.5 + scroll * 0.35;
      const rx = 0.42 + pointer.y * 0.35 + scroll * 0.12;
      const radius = Math.min(width, height) * 0.34;
      const originX = width * 0.52 + pointer.x * 14;
      const originY = height * 0.48 + pointer.y * 10;

      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(originX, originY, radius * 0.15, originX, originY, radius * 1.7);
      glow.addColorStop(0, "rgba(182, 243, 107, 0.14)");
      glow.addColorStop(0.42, "rgba(86, 217, 232, 0.05)");
      glow.addColorStop(1, "rgba(7, 9, 12, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(originX, originY, radius * 1.7, 0, Math.PI * 2);
      context.fill();

      context.lineWidth = 1;
      for (let meridian = 0; meridian < meridians; meridian += 1) {
        const phi = (meridian / meridians) * Math.PI;
        const points: Point[] = [];
        for (let step = 0; step <= 40; step += 1) {
          const theta = (step / 40) * Math.PI * 2;
          points.push(project(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta), ry, rx));
        }
        stroke(points, meridian % 4 === 0 ? "rgba(182, 243, 107, 0.62)" : "rgba(244, 246, 242, 0.16)", originX, originY, radius);
      }
      for (let band = 1; band < parallels; band += 1) {
        const phi = (band / parallels) * Math.PI;
        const points: Point[] = [];
        for (let step = 0; step <= 56; step += 1) {
          const theta = (step / 56) * Math.PI * 2;
          points.push(project(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta), ry, rx));
        }
        stroke(points, "rgba(86, 217, 232, 0.32)", originX, originY, radius);
      }

      for (let node = 0; node < nodes; node += 1) {
        const theta = t * 0.32 + node * 1.65;
        const phi = 0.55 + (node % 4) * 0.48;
        const point = project(Math.sin(phi) * Math.cos(theta), Math.cos(phi) * 0.9, Math.sin(phi) * Math.sin(theta), ry, rx);
        if (point.z < -0.2) continue;
        context.beginPath();
        context.fillStyle = node % 3 === 0 ? "#B6F36B" : "rgba(86, 217, 232, 0.9)";
        context.arc(originX + point.x * radius, originY + point.y * radius, node % 3 === 0 ? 3 : 2, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    const onPointer = (event: PointerEvent) => {
      if (!fine) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      if (reduce) draw(0);
    };
    const resetPointer = () => {
      pointer.x = 0;
      pointer.y = 0;
      if (reduce) draw(0);
    };
    const onScroll = () => {
      scroll = Math.min(window.scrollY / 900, 1);
      if (reduce) draw(0);
    };

    resize();
    draw(performance.now());
    const observer = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running && !reduce) frame = window.requestAnimationFrame(draw);
    });
    visibility.observe(canvas);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="hero-core">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
