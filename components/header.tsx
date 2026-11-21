"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems, profile } from "@/data/profile";
import { useSite } from "@/components/providers";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const { setPaletteOpen, setTerminalOpen } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const main = document.getElementById("content");
    const footer = document.querySelector("footer");
    document.body.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`nav-shell ${open ? "menu-open" : scrolled ? "scrolled" : ""}`}>
      <div className="site relative z-20 flex h-[4.25rem] items-center justify-between gap-3">
        <Link href="/" className="text-[1.35rem] font-medium tracking-[-0.06em]" aria-label="Vivek Vasani, home">
          {profile.monogram}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative pb-1 text-[0.92rem] text-[var(--muted)] hover:text-[var(--ink)]">
              <span className={active(item.href) ? "text-[var(--ink)]" : ""}>{item.label}</span>
              {active(item.href) ? (
                <motion.span layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent-text)]" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn-ghost hidden !min-h-9 !px-3 lg:inline-flex" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
            Ctrl K
          </button>
          <button className="btn-ghost hidden !min-h-9 !px-3 xl:inline-flex" onClick={() => setTerminalOpen(true)} aria-label="Open terminal">
            Terminal
          </button>
          <ThemeToggle />
          <Link href="/resume" className="btn !min-h-9 !px-3">
            Resume
          </Link>
          <button
            className="btn-ghost !min-h-9 !px-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <div id="mobile-nav" className="mobile-nav lg:hidden">
          <nav className="site flex min-h-full flex-col pb-8" aria-label="Mobile">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-link ${active(item.href) ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
              >
                {item.label}
                <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent-text)]">0{index + 1}</span>
              </Link>
            ))}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">
              <button type="button" className="min-h-11" onClick={() => setPaletteOpen(true)}>
                Command palette
              </button>
              <button type="button" className="min-h-11" onClick={() => setTerminalOpen(true)}>
                Terminal
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
