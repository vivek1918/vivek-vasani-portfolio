import type { Metadata } from "next";
import { ExperienceView } from "@/components/experience-view";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Engineering at Veefin Solutions, an AI/ML fellowship at SimPPL, and a machine learning internship at IIT Patna.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
