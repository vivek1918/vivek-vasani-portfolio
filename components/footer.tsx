import Link from "next/link";
import { navItems, profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] md:mt-24">
      <div className="site grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-4xl tracking-[-0.06em]">{profile.monogram}</p>
          <p className="mt-4 max-w-sm text-lg leading-snug">{profile.brandLine}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">{profile.location}</p>
        </div>
        <div className="md:col-span-3">
          <p className="kicker">Navigate</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[var(--muted)] hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="kicker">Contact</p>
          <ul className="mt-4 space-y-2 text-[var(--muted)]">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.phoneHref}>{profile.phone}</a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="site flex flex-col gap-2 border-t border-[var(--line)] py-5 text-sm text-[var(--faint)] sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Ctrl/Cmd K to search · Ctrl/Cmd / for the terminal</p>
      </div>
    </footer>
  );
}
