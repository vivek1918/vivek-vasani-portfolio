"use client";

import { useEffect } from "react";
import { CommandPalette } from "@/components/command-palette";
import { CustomCursor, ScrollProgress } from "@/components/custom-cursor";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers, useSite } from "@/components/providers";
import { TerminalPanel } from "@/components/terminal-panel";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Chrome>{children}</Chrome>
    </Providers>
  );
}

function Chrome({ children }: { children: React.ReactNode }) {
  const { paletteOpen } = useSite();

  useEffect(() => {
    document.body.style.overflow = paletteOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Header />
      <main id="content">{children}</main>
      <Footer />
      <CommandPalette />
      <TerminalPanel />
      <CustomCursor />
    </>
  );
}
