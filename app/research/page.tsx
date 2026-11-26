import type { Metadata } from "next";
import { ResearchView } from "@/components/research-view";
import { researchPapers } from "@/data/research";

const titles = researchPapers.map((paper) => paper.title).join(" · ");

export const metadata: Metadata = {
  title: "Research",
  description: `Unpublished academic research by Vivek Vasani and collaborators. ${titles}`,
  alternates: { canonical: "/research" },
  keywords: [
    "GRAPHMIND",
    "Semantic Knowledge Graph",
    "GraphRAG",
    "Stable Diffusion XL",
    "Computer Vision",
    "Latent Diffusion Models",
    "unpublished research",
    "Vivek Vasani",
    "Dwarkadas J. Sanghvi College of Engineering",
  ],
};

export default function ResearchPage() {
  return <ResearchView />;
}
