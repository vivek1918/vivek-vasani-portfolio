import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";
import { profile } from "@/data/profile";
import { getGithub } from "@/lib/github";

export const metadata: Metadata = {
  title: "Vivek Vasani — Software Developer",
  description: profile.heroIntro,
  alternates: { canonical: "/" },
};

export default async function HomePage({ searchParams }: { searchParams: { node?: string } }) {
  const github = await getGithub();
  return <HomeView github={github} focusNode={searchParams.node} />;
}
