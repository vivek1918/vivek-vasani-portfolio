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
        <h1 className="max-w-3xl text-[clamp(2.15rem,8vw,4.5rem)] tracking-[-0.045em]">The document behind the site.</h1>
        <div className="resume-actions">
          <a className="btn" href={profile.resumeFile} download>
            Download resume
          </a>
          <a className="btn-ghost" href={profile.resumeFile} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      </div>
      <p className="mt-6 max-w-xl text-[var(--muted)]">
        This is the supplied resume. Experience, education, and projects on the site follow it. On a phone, Open PDF uses the device viewer when the preview is too small to read.
      </p>
      <div className="resume-frame">
        <iframe title="Vivek Vasani resume" src={profile.resumeFile} />
      </div>
    </div>
  );
}
