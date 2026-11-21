import Link from "next/link";
import { graphNode } from "@/data/graph";

const hints = ["python", "graphmind", "veefin"].flatMap((id) => {
  const node = graphNode(id);
  return node ? [node] : [];
});

export default function NotFound() {
  return (
    <div className="site flex min-h-[70vh] flex-col justify-end pb-16 pt-20">
      <p className="kicker">404</p>
      <h1 className="display mt-4 max-w-3xl text-[clamp(2.4rem,10vw,6.5rem)]">This page is not in the map.</h1>
      <p className="mt-6 max-w-md text-lg text-[var(--muted)]">The address does not match a page or a case study. These three nodes are on the map.</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {hints.map((node) => (
          <li key={node.id}>
            <Link className="btn-ghost" href={`/?node=${node.id}#graph`}>
              {node.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn" href="/#graph">
          Open the map
        </Link>
        <Link className="btn-ghost" href="/projects">
          Browse projects
        </Link>
      </div>
    </div>
  );
}
