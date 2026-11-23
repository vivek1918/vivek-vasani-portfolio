import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience-view";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Eight roles: software engineering at Veefin, examination operations at Programmatix, backend work at Faclon Labs, machine learning at IIT Patna, an AI/ML fellowship at SimPPL, campus work with E-Cell IIT Bombay, and UI/UX at WEBXELA.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
