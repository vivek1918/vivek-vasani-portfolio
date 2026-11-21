import type { Metadata } from "next";
import { AboutView } from "@/components/about-view";

export const metadata: Metadata = {
  title: "About",
  description:
    "The engineering story of Vivek Vasani: AI and data science studies, a SimPPL fellowship, an IIT Patna internship, and engineering work at Veefin.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
