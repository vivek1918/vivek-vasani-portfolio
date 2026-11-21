import type { Metadata } from "next";
import { SkillsView } from "@/components/skills-view";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Programming, backend, AI, DevOps, and analytics skills used in Vivek Vasani’s projects and roles.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return <SkillsView />;
}
