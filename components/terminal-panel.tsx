"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { researchPapers } from "@/data/research";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import { useSite } from "@/components/providers";

type Line = { kind: "in" | "out"; text: string };

const help = [
  "help        show commands",
  "about       short introduction",
  "projects    list case studies",
  "open <name> open a case study",
  "research    list research papers",
  "skills      list skill groups",
  "experience  list roles",
  "github      open GitHub",
  "contact     go to contact",
  "resume      open the resume",
  "theme       toggle light and dark",
  "clear       clear the terminal",
].join("\n");

export function TerminalPanel() {
  const { terminalOpen, setTerminalOpen, toggleTheme } = useSite();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "Vivek Vasani — type help" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus();
  }, [terminalOpen]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines, terminalOpen]);

  if (!terminalOpen) return null;

  const respond = (command: string) => {
    const [head, ...rest] = command.trim().toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    const say = (text: string) => setLines((current) => [...current, { kind: "in", text: command }, { kind: "out", text }]);
    const go = (href: string, text: string) => {
      say(text);
      setTerminalOpen(false);
      router.push(href);
    };

    if (!head) return;
    if (head === "clear") {
      setLines([]);
      return;
    }
    if (head === "help") return say(help);
    if (head === "about") {
      return say(`${profile.name}, ${profile.role} in ${profile.location}. ${profile.summary}`);
    }
    if (head === "projects") {
      return say(projects.map((project) => `${project.index}  ${project.title}  /projects/${project.slug}`).join("\n"));
    }
    if (head === "open") {
      const match = projects.find((project) => project.slug === arg || project.title.toLowerCase().includes(arg));
      if (!match) return say("Name a project. Try: open physioplay");
      return go(`/projects/${match.slug}`, `Opening ${match.title}.`);
    }
    if (head === "skills") return say(skills.map((skill) => `${skill.group} — ${skill.name}`).join("\n"));
    if (head === "research") {
      return go(
        "/research",
        researchPapers.map((paper) => `${paper.statusLabel}  ${paper.shortTitle}  ${paper.pdfHref}`).join("\n"),
      );
    }
    if (head === "experience") return say(experiences.map((item) => `${item.role}, ${item.org} (${item.period})`).join("\n"));
    if (head === "github") {
      say("Opening GitHub.");
      window.open(profile.github, "_blank", "noopener,noreferrer");
      return;
    }
    if (head === "contact") return go("/contact", "Opening contact.");
    if (head === "resume") return go("/resume", "Opening resume.");
    if (head === "theme") {
      toggleTheme();
      return say("Theme toggled.");
    }
    say(`Unknown command “${head}”. Type help.`);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] md:left-6 md:right-auto md:w-[440px]">
      <section className="terminal" aria-label="Developer terminal">
        <header className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
          <p className="kicker">Terminal</p>
          <button className="text-sm text-[var(--muted)]" onClick={() => setTerminalOpen(false)} aria-label="Close terminal">
            Close
          </button>
        </header>
        <div ref={scroller} className="max-h-72 overflow-auto px-3 py-3 font-mono text-[13px] leading-relaxed">
          {lines.map((line, index) => (
            <pre key={`${line.kind}-${index}`} className={`whitespace-pre-wrap ${line.kind === "in" ? "text-[var(--accent-text)]" : "text-[var(--muted)]"}`}>
              {line.kind === "in" ? `› ${line.text}` : <Typed text={line.text} animate={!reduce && index === lines.length - 1} />}
            </pre>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-[var(--line)] px-3 py-2 font-mono"
          onSubmit={(event) => {
            event.preventDefault();
            const command = value;
            if (command.trim()) setHistory((current) => [command, ...current].slice(0, 20));
            setHistoryIndex(-1);
            setValue("");
            respond(command);
          }}
        >
          <label className="sr-only" htmlFor="terminal-input">
            Terminal command
          </label>
          <span aria-hidden="true">›</span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
              event.preventDefault();
              if (history.length === 0) return;
              const next = event.key === "ArrowUp" ? Math.min(historyIndex + 1, history.length - 1) : Math.max(historyIndex - 1, -1);
              setHistoryIndex(next);
              setValue(next === -1 ? "" : history[next]);
            }}
            className="w-full bg-transparent outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </section>
    </div>
  );
}

function Typed({ text, animate }: { text: string; animate: boolean }) {
  const [count, setCount] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) {
      setCount(text.length);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += Math.max(1, Math.ceil(text.length / 48));
      if (index >= text.length) {
        setCount(text.length);
        window.clearInterval(timer);
        return;
      }
      setCount(index);
    }, 16);
    return () => window.clearInterval(timer);
  }, [animate, text]);

  return <>{text.slice(0, count)}{animate && count < text.length ? "▍" : ""}</>;
}
