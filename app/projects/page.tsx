import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects-view";
import { getGithub } from "@/lib/github";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies from Vivek Vasani’s public repositories: PhysioPlay, SocialPulse, GraphMind, FinTech Analytics Pro, and more.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const github = await getGithub();
  return <ProjectsView github={github} />;
}
