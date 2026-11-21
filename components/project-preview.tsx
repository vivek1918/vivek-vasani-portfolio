import type { Project } from "@/data/projects";
import { ProjectMark } from "@/components/project-mark";

export function ProjectPreview({ project }: { project: Project }) {
  const sentence = `${project.problem.split(". ")[0]}.`;
  return (
    <div className="preview">
      <ProjectMark slug={project.slug} />
      <div className="preview-detail">
        <p>{sentence}</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">{project.stack.slice(0, 4).join(" · ")}</p>
      </div>
    </div>
  );
}
