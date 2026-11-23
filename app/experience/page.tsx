import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience-view";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Eight roles, with the original Programmatix and WEBXELA letters and the IIT Patna and WEBXELA internship certificates.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
