import type { Metadata } from "next";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: "View or download the resume of Vivek Vasani.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="site pb-8 pt-12">
      <p className="kicker">Resume</p>
      <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h1 className="max-w-3xl text-5xl tracking-[-0.045em] md:text-7xl">The document behind the site.</h1>
        <div className="flex flex-wrap gap-3">
          <a className="btn" href={profile.resumeFile} download>
            Download resume
          </a>
          <a className="btn-ghost" href={profile.resumeFile} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      </div>
      <p className="mt-6 max-w-xl text-[var(--muted)]">
        This is the supplied resume. Experience, education, and projects on the site follow it.
      </p>
      <iframe title="Vivek Vasani resume" src={profile.resumeFile} className="mt-10 h-[78vh] w-full border border-[var(--line)] bg-[var(--bg-raise)]" />
    </div>
  );
}
