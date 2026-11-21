export type GraphKind = "language" | "technology" | "tool" | "project" | "experience" | "concept";
export type GraphFilter = "All" | "Technologies" | "Projects" | "Experience" | "Tools";

export type GraphNode = {
  id: string;
  label: string;
  kind: GraphKind;
  summary: string;
  href?: string;
};

export type GraphLink = {
  source: string;
  target: string;
};

export const graphFilters: GraphFilter[] = ["All", "Technologies", "Projects", "Experience", "Tools"];

export const graphPaths: { id: string; label: string; nodes: string[] }[] = [
  { id: "physio", label: "Python → FastAPI → PhysioPlay", nodes: ["python", "fastapi", "physioplay"] },
  { id: "rag", label: "RAG → GraphMind → Neo4j", nodes: ["rag", "graphmind", "neo4j"] },
  { id: "mdm", label: "Java → Spring Boot → MDM → Veefin", nodes: ["java", "spring", "mdm", "veefin"] },
  { id: "iit", label: "Machine Learning → models → IIT Patna", nodes: ["ml", "classification", "iitp"] },
];

export const graphNodes: GraphNode[] = [
  { id: "python", label: "Python", kind: "language", summary: "The language behind PhysioPlay, GraphMind, the IIT Patna models, and the analytics repositories." },
  { id: "java", label: "Java", kind: "language", summary: "The language used for the MDM services built at Veefin." },
  { id: "sql", label: "SQL", kind: "language", summary: "Used for the analytics projects and listed on the resume as a working language." },
  { id: "fastapi", label: "FastAPI", kind: "technology", summary: "The API layer of PhysioPlay, serving the pose pipeline." },
  { id: "spring", label: "Spring Boot", kind: "technology", summary: "The framework used for MDM services at Veefin." },
  { id: "docker", label: "Docker", kind: "tool", summary: "Container work on the resume, alongside Jenkins and AWS." },
  { id: "jenkins", label: "Jenkins", kind: "tool", summary: "CI tooling listed with the DevOps stack on the resume." },
  { id: "aws", label: "AWS", kind: "tool", summary: "Cloud tooling listed with Docker and Jenkins on the resume." },
  { id: "ml", label: "Machine Learning", kind: "concept", summary: "The thread connecting the IIT Patna models, PhysioPlay, and the analytics work." },
  { id: "nlp", label: "NLP", kind: "concept", summary: "Used in GraphMind’s retrieval pipeline and listed under AI/ML on the resume." },
  { id: "rag", label: "RAG", kind: "concept", summary: "GraphMind’s approach: retrieve, then generate, with a graph in the path." },
  { id: "llm", label: "LLM", kind: "concept", summary: "The generation side of GraphMind’s RAG pipeline." },
  { id: "neo4j", label: "Neo4j", kind: "technology", summary: "The graph database in GraphMind." },
  { id: "classification", label: "DRCNN / DGAN / EMA-IDS", kind: "concept", summary: "Models built during the IIT Patna research internship. The resume reports 96–98% accuracy." },
  { id: "mdm", label: "MDM services", kind: "concept", summary: "Spring Boot services for the MDM team at Veefin." },
  { id: "physioplay", label: "PhysioPlay", kind: "project", summary: "A FastAPI and Streamlit physiotherapy chatbot. The public repository is a fork.", href: "/projects/physioplay" },
  { id: "socialpulse", label: "SocialPulse", kind: "project", summary: "A SimPPL research-engineering assignment: a dashboard and RAG assistant over Reddit posts.", href: "/projects/socialpulse" },
  { id: "graphmind", label: "GraphMind", kind: "project", summary: "GraphyRAG: documents become a Neo4j graph, then hybrid retrieval answers from it.", href: "/projects/graphmind" },
  { id: "fintech-analytics", label: "FinTech Analytics", kind: "project", summary: "A Python and SQLite lending analytics repository with a Drive walkthrough.", href: "/projects/fintech-analytics" },
  { id: "seating-arrangement", label: "Exam Seating", kind: "project", summary: "The public seating allocator from the IIT Patna internship.", href: "/projects/seating-arrangement" },
  { id: "veefin", label: "Veefin", kind: "experience", summary: "Engineer since April 2026, across DevOps automation and Java/Spring Boot MDM services.", href: "/experience" },
  { id: "simppl", label: "SimPPL", kind: "experience", summary: "AI/ML Fellow, February 2024 – March 2025. SocialPulse is the public assignment from that work.", href: "/experience" },
  { id: "iitp", label: "IIT Patna", kind: "experience", summary: "Machine Learning Intern, March 2025 – June 2025. Classification models with a reported 96–98% accuracy, plus the seating allocator.", href: "/experience" },
];

export const graphLinks: GraphLink[] = [
  { source: "python", target: "fastapi" },
  { source: "fastapi", target: "physioplay" },
  { source: "python", target: "physioplay" },
  { source: "ml", target: "physioplay" },
  { source: "python", target: "graphmind" },
  { source: "fastapi", target: "graphmind" },
  { source: "rag", target: "graphmind" },
  { source: "graphmind", target: "neo4j" },
  { source: "nlp", target: "graphmind" },
  { source: "llm", target: "rag" },
  { source: "java", target: "spring" },
  { source: "spring", target: "mdm" },
  { source: "mdm", target: "veefin" },
  { source: "ml", target: "classification" },
  { source: "classification", target: "iitp" },
  { source: "python", target: "classification" },
  { source: "socialpulse", target: "simppl" },
  { source: "python", target: "socialpulse" },
  { source: "fastapi", target: "socialpulse" },
  { source: "nlp", target: "simppl" },
  { source: "llm", target: "simppl" },
  { source: "python", target: "seating-arrangement" },
  { source: "seating-arrangement", target: "iitp" },
  { source: "python", target: "veefin" },
  { source: "docker", target: "veefin" },
  { source: "jenkins", target: "veefin" },
  { source: "aws", target: "veefin" },
  { source: "python", target: "fintech-analytics" },
  { source: "sql", target: "fintech-analytics" },
];

const groups: Record<Exclude<GraphFilter, "All">, GraphKind[]> = {
  Technologies: ["language", "technology", "concept"],
  Projects: ["project"],
  Experience: ["experience"],
  Tools: ["tool"],
};

export function nodeGroup(kind: GraphKind): Exclude<GraphFilter, "All"> {
  if (kind === "project") return "Projects";
  if (kind === "experience") return "Experience";
  if (kind === "tool") return "Tools";
  return "Technologies";
}

export function neighborsOf(id: string) {
  return graphLinks
    .filter((link) => link.source === id || link.target === id)
    .map((link) => (link.source === id ? link.target : link.source));
}

export function graphNode(id: string) {
  return graphNodes.find((node) => node.id === id);
}

export function pathEdge(path: string[] | undefined, source: string, target: string) {
  if (!path) return false;
  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    if ((source === from && target === to) || (source === to && target === from)) return true;
  }
  return false;
}

export function visibleNodeIds(filter: GraphFilter, query: string) {
  const needle = query.trim().toLowerCase();
  let ids = new Set(
    graphNodes
      .filter((node) => filter === "All" || groups[filter].includes(node.kind))
      .filter((node) => !needle || node.label.toLowerCase().includes(needle))
      .map((node) => node.id),
  );
  if (needle) {
    graphLinks.forEach((link) => {
      if (ids.has(link.source)) ids.add(link.target);
      if (ids.has(link.target)) ids.add(link.source);
    });
  }
  return ids;
}
