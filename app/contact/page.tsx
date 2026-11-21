import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContactVisual } from "@/components/contact-visual";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Vivek Vasani about engineering work, collaborations, and product ideas.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="site grid gap-10 pb-8 pt-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="kicker">Contact</p>
        <h1 className="display mt-4 text-[clamp(2.2rem,9vw,5.4rem)]">Let’s create something that matters.</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--muted)]">
          Have an interesting idea, a challenging engineering problem, or an opportunity to collaborate? I&apos;d love to hear about it.
        </p>
      </div>
      <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
        <ContactForm />
      </div>
      <div className="lg:col-span-6">
        <ul className="border-t border-[var(--line)]">
          <li className="grid gap-1 border-b border-[var(--line)] py-4 sm:grid-cols-[7rem_1fr]">
            <span className="kicker">Email</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li className="grid gap-1 border-b border-[var(--line)] py-4 sm:grid-cols-[7rem_1fr]">
            <span className="kicker">GitHub</span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              github.com/vivek1918
            </a>
          </li>
          <li className="grid gap-1 border-b border-[var(--line)] py-4 sm:grid-cols-[7rem_1fr]">
            <span className="kicker">LinkedIn</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              Vivek Vasani
            </a>
          </li>
          <li className="grid gap-1 border-b border-[var(--line)] py-4 sm:grid-cols-[7rem_1fr]">
            <span className="kicker">Based in</span>
            <span>{profile.location}</span>
          </li>
          <li className="grid gap-1 border-b border-[var(--line)] py-4 sm:grid-cols-[7rem_1fr]">
            <span className="kicker">Resume</span>
            <a href={profile.resumeFile} download>
              Download PDF
            </a>
          </li>
        </ul>
        <ContactVisual />
      </div>
    </div>
  );
}
