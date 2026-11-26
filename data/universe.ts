import { certificates } from "@/data/certificates";
import { experienceDocuments } from "@/data/documents";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { researchPapers } from "@/data/research";
import { skills } from "@/data/skills";

export type UniverseCategory =
  | "identity"
  | "domain"
  | "company"
  | "experience"
  | "project"
  | "skill"
  | "education"
  | "research"
  | "document"
  | "certificate"
  | "presence";

export type UniverseAction = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
};

export type UniverseNode = {
  id: string;
  name: string;
  category: UniverseCategory;
  summary: string;
  details: string[];
  layer: 0 | 1 | 2 | 3;
  cluster: string;
  importance: number;
  domains: string[];
  actions: UniverseAction[];
  position: [number, number, number];
};

export type UniverseLink = {
  source: string;
  target: string;
  type: string;
};

export const universeFilters = [
  "All",
  "Projects",
  "Skills",
  "Experience",
  "AI/ML",
  "Backend",
  "DevOps",
  "Education",
  "Research",
  "Certifications",
  "Documents",
] as const;

export type UniverseFilter = (typeof universeFilters)[number];

const CLUSTERS = ["software", "backend", "aiml", "devops", "data", "iot", "uiux", "leadership", "education"] as const;

const experienceCluster: Record<string, string> = {
  veefin: "software",
  "veefin-intern": "software",
  programmatix: "leadership",
  faclon: "iot",
  iitp: "aiml",
  simppl: "aiml",
  ecell: "leadership",
  webxela: "uiux",
};

const skillCluster: Record<string, string> = {
  Programming: "software",
  Backend: "backend",
  "AI / ML": "aiml",
  "DevOps / Cloud": "devops",
  "Data / Analytics": "data",
};

const aliases: Record<string, string> = {
  "spring boot": "spring",
  "machine learning": "ml",
  "deep learning": "dl",
  "large language models": "llm",
  "llm applications": "llm",
  "rest apis": "rest",
  nlp: "nlp",
  python: "python",
  java: "java",
  sql: "sql",
  pandas: "pandas",
  numpy: "numpy",
  matplotlib: "matplotlib",
  seaborn: "seaborn",
  fastapi: "fastapi",
  docker: "docker",
  jenkins: "jenkins",
  aws: "aws",
  git: "git",
  "power bi": "powerbi",
  tableau: "tableau",
  "c++": "cpp",
  c: "c",
};

const domainForCategory = (category: string) => {
  if (category === "AI / ML") return "aiml";
  if (category === "Data Analytics") return "data";
  if (category === "Backend" || category === "Full Stack") return "backend";
  if (category === "Automation") return "software";
  return "software";
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const keyOf = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();

const anchors = new Map<string, string>();

function build() {
  const nodes: UniverseNode[] = [];
  const links: UniverseLink[] = [];
  const seen = new Set<string>();

  const add = (node: Omit<UniverseNode, "position">) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push({ ...node, position: [0, 0, 0] });
  };

  const link = (source: string, target: string, type: string) => {
    if (source === target) return;
    const key = [source, target, type].sort().join("|");
    if (seen.has(`link:${key}`)) return;
    seen.add(`link:${key}`);
    links.push({ source, target, type });
  };

  add({
    id: "vivek",
    name: "Vivek Vasani",
    category: "identity",
    summary: profile.heroIntro,
    details: [
      `${profile.education.degree}, ${profile.education.school}, ${profile.education.period}. CGPA ${profile.education.cgpa}.`,
      profile.location,
    ],
    layer: 0,
    cluster: "software",
    importance: 5,
    domains: [],
    actions: [
      { label: "GitHub", href: profile.github, external: true },
      { label: "LinkedIn", href: profile.linkedin, external: true },
      { label: "Resume", href: profile.resumeFile },
    ],
  });

  const domains: { id: string; name: string; summary: string }[] = [
    { id: "software", name: "Software Engineering", summary: "The current full-time role at Veefin, plus the software projects published on GitHub." },
    { id: "backend", name: "Backend Development", summary: "Java and Spring Boot at Veefin, backend work at Faclon Labs, and API-backed projects." },
    { id: "aiml", name: "Artificial Intelligence & Machine Learning", summary: "SimPPL, IIT Patna, and the public AI projects: PhysioPlay, SocialPulse, and GraphMind." },
    { id: "devops", name: "DevOps & Cloud", summary: "Docker, Jenkins, AWS, and Git are listed on the skills page from the resume. Docker also appears in GraphMind." },
    { id: "data", name: "Data Science & Analytics", summary: "FinTech Analytics, the Zomato notebook, and the Python data libraries named with that work." },
    { id: "iot", name: "Industrial IoT", summary: "The Faclon Labs internship, using MongoDB, Redis, RabbitMQ, and InfluxDB." },
    { id: "uiux", name: "UI/UX Design", summary: "The WEBXELA internship, with the certificate and letter of recommendation." },
    { id: "leadership", name: "Leadership & Operations", summary: "Examination operations at Programmatix and campus programs with E-Cell, IIT Bombay." },
    { id: "education", name: "Education & Research", summary: "B.Tech studies at DJ Sanghvi, unpublished GRAPHMIND and Stable Diffusion research, and the IIT Patna machine learning internship." },
  ];

  domains.forEach((domain) => {
    add({
      id: `domain-${domain.id}`,
      name: domain.name,
      category: "domain",
      summary: domain.summary,
      details: [],
      layer: 1,
      cluster: domain.id,
      importance: 4,
      domains: [domain.id],
      actions: [],
    });
    link("vivek", `domain-${domain.id}`, "domain");
  });

  const orgId = new Map<string, string>();
  experiences.forEach((item) => {
    const id = `org-${slug(item.org)}`;
    orgId.set(item.org, id);
    const cluster = experienceCluster[item.id] ?? "software";
    const roles = experiences.filter((entry) => entry.org === item.org);
    add({
      id,
      name: item.org,
      category: "company",
      summary: `Organization for ${roles.map((entry) => entry.role).join(" and ")}.`,
      details: roles.map((entry) => `${entry.role} · ${entry.period}`),
      layer: 2,
      cluster,
      importance: 3,
      domains: [cluster],
      actions: roles.map((entry) => ({ label: entry.role, href: `/experience#xp-${entry.id}` })),
    });
  });

  experiences.forEach((item) => {
    const cluster = experienceCluster[item.id] ?? "software";
    add({
      id: item.id,
      name: `${item.role}`,
      category: "experience",
      summary: `${item.org}. ${item.employmentType}. ${item.period}. ${item.summary}`,
      details: [
        item.workMode + (item.location ? ` · ${item.location}` : ""),
        ...item.points,
        item.technologies.length ? `Skills: ${item.technologies.join(", ")}` : "",
      ].filter(Boolean),
      layer: 2,
      cluster,
      importance: item.current ? 4 : 3,
      domains: [cluster, ...(item.id === "veefin" || item.id === "veefin-intern" || item.id === "faclon" ? ["backend"] : []), ...(item.id === "iitp" ? ["education"] : [])],
      actions: [{ label: "Open experience", href: `/experience#xp-${item.id}` }],
    });
    link(item.id, orgId.get(item.org)!, "organization");
    link(item.id, `domain-${cluster}`, "domain");
    if (item.id === "veefin" || item.id === "veefin-intern" || item.id === "faclon") link(item.id, "domain-backend", "domain");
    if (item.id === "iitp") link(item.id, "domain-education", "research");
    item.related.forEach((slugId) => link(item.id, slugId, "project"));
  });

  add({
    id: "djsce",
    name: profile.education.school,
    category: "education",
    summary: `${profile.education.degree}. ${profile.education.period}. CGPA ${profile.education.cgpa}.`,
    details: [],
    layer: 2,
    cluster: "education",
    importance: 4,
    domains: ["education"],
    actions: [{ label: "About", href: "/about" }],
  });
  link("vivek", "djsce", "studied");
  link("djsce", "domain-education", "domain");

  projects.forEach((project) => {
    const cluster = domainForCategory(project.categories[0] ?? "");
    const domainsForProject = project.categories.map(domainForCategory);
    const actions: UniverseAction[] = [
      { label: "View case study", href: `/projects/${project.slug}` },
      { label: "View GitHub", href: project.github, external: true },
    ];
    if (project.demo) {
      const watch = /recording|demo|watch/i.test(project.demo.label);
      actions.push({
        label: watch ? "Watch demo" : project.demo.label.replace(" ↗", ""),
        href: project.demo.href,
        external: true,
      });
    }
    add({
      id: project.slug,
      name: project.title,
      category: "project",
      summary: project.summary,
      details: [project.contribution, `Stack: ${project.stack.join(", ")}`],
      layer: 2,
      cluster,
      importance: project.featured ? 4 : 3,
      domains: domainsForProject,
      actions,
    });
    domainsForProject.forEach((domain) => link(project.slug, `domain-${domain}`, "domain"));
  });

  skills.forEach((skill) => {
    const cluster = skillCluster[skill.group] ?? "software";
    add({
      id: skill.id,
      name: skill.name,
      category: "skill",
      summary: skill.summary,
      details: [skill.usedFor],
      layer: 3,
      cluster,
      importance: 2,
      domains: [cluster],
      actions: [],
    });
    link(skill.id, `domain-${cluster}`, "skill");
    skill.projects.forEach((projectId) => link(skill.id, projectId, "used-in"));
  });

  const skillByName = new Map(skills.map((skill) => [keyOf(skill.name), skill.id]));
  Object.entries(aliases).forEach(([name, id]) => skillByName.set(name, id));

  const ensureSkill = (name: string, cluster: string, summary: string) => {
    const existing = skillByName.get(keyOf(name));
    if (existing) return existing;
    const id = slug(name);
    add({
      id,
      name,
      category: "skill",
      summary,
      details: [],
      layer: 3,
      cluster,
      importance: 2,
      domains: [cluster],
      actions: [],
    });
    link(id, `domain-${cluster}`, "skill");
    skillByName.set(keyOf(name), id);
    return id;
  };

  experiences.forEach((item) => {
    const cluster = experienceCluster[item.id] ?? "software";
    item.technologies.forEach((tech) => {
      const mapped = skillByName.get(keyOf(tech));
      if (mapped === "domain-software" || mapped === "domain-backend" || mapped === "domain-aiml" || mapped === "domain-iot" || mapped === "domain-uiux") return;
      const broad: Record<string, string> = {
        "backend development": "domain-backend",
        "software engineering": "domain-software",
        "industrial iot": "domain-iot",
        "artificial intelligence": "domain-aiml",
        "ui/ux design": "domain-uiux",
        "user experience": "domain-uiux",
        "interface design": "domain-uiux",
        wireframing: "domain-uiux",
      };
      if (broad[keyOf(tech)]) {
        link(item.id, broad[keyOf(tech)], "skill");
        return;
      }
      const id = mapped ?? ensureSkill(tech, cluster, `Listed on the ${item.role} role at ${item.org}.`);
      link(item.id, id, "skill");
    });
  });

  projects.forEach((project) => {
    const cluster = domainForCategory(project.categories[0] ?? "");
    project.stack.forEach((tech) => {
      const id = skillByName.get(keyOf(tech)) ?? ensureSkill(tech, cluster, `Named in the published stack for ${project.title}.`);
      link(project.slug, id, "stack");
    });
  });

  add({
    id: "classification",
    name: "DRCNN, DGAN, EMA-IDS",
    category: "skill",
    summary: "Classification models from the IIT Patna internship. The experience record reports 96–98% accuracy.",
    details: [],
    layer: 3,
    cluster: "aiml",
    importance: 3,
    domains: ["aiml"],
    actions: [{ label: "Open experience", href: "/experience#xp-iitp" }],
  });
  link("classification", "iitp", "research");
  link("classification", "ml", "model");
  link("classification", "dl", "model");
  link("classification", "domain-aiml", "skill");

  const ensureConcept = (id: string, name: string, summary: string) => {
    if (seen.has(id)) return id;
    add({
      id,
      name,
      category: "skill",
      summary,
      details: [],
      layer: 3,
      cluster: "aiml",
      importance: 2,
      domains: ["aiml", "education"],
      actions: [{ label: "Open research", href: "/research" }],
    });
    link(id, "domain-aiml", "skill");
    skillByName.set(keyOf(name), id);
    return id;
  };

  researchPapers.forEach((paper) => {
    add({
      id: paper.graphNodeId,
      name: paper.shortTitle,
      category: "research",
      summary: paper.summary,
      details: [
        `Category: ${paper.category}.`,
        `Authors: ${paper.authors.join(", ")}.`,
        `Institution: ${paper.institution}.`,
        paper.guide ? `Project guide: ${paper.guide}.` : "",
        `Publication status: ${paper.statusLabel}. Not IEEE-published, journal-published, conference-published, or peer-reviewed.`,
        `Main technologies: ${paper.technologies.slice(0, 8).join(", ")}.`,
        paper.reportedFindings[0] ?? "",
      ].filter(Boolean),
      layer: 2,
      cluster: "education",
      importance: 4,
      domains: ["education", "aiml"],
      actions: [
        { label: "Read document", href: paper.pdfHref, external: true },
        { label: "Download PDF", href: paper.pdfHref, download: true },
        { label: "Research page", href: `/research#research-${paper.id}` },
      ],
    });
    link(paper.graphNodeId, "vivek", "authored");
    link(paper.graphNodeId, "domain-education", "domain");
    link(paper.graphNodeId, "domain-aiml", "domain");
    link(paper.graphNodeId, "djsce", "institution");

    (paper.graphConcepts ?? []).forEach((concept) => {
      ensureConcept(concept.id, concept.name, concept.summary);
      link(paper.graphNodeId, concept.id, "uses");
    });

    (paper.graphSkills ?? []).forEach((skillName) => {
      const id =
        skillByName.get(keyOf(skillName)) ??
        ensureSkill(skillName, "aiml", `Documented technology or method in ${paper.shortTitle}.`);
      link(paper.graphNodeId, id, "uses");
    });

    (paper.relatedProjectIds ?? []).forEach((projectId) => {
      if (seen.has(projectId)) link(paper.graphNodeId, projectId, "related-project");
    });

    add({
      id: paper.graphPdfNodeId,
      name: `${paper.shortTitle} PDF`,
      category: "document",
      summary: `Original PDF for ${paper.title}. ${paper.statusLabel}.`,
      details: ["Research paper", paper.status, paper.category],
      layer: 3,
      cluster: "education",
      importance: 2,
      domains: ["education", "aiml"],
      actions: [
        { label: "Read PDF", href: paper.pdfHref, external: true },
        { label: "Download PDF", href: paper.pdfHref, download: true },
        { label: "Research page", href: `/research#research-${paper.id}` },
      ],
    });
    link(paper.graphPdfNodeId, paper.graphNodeId, "document");
  });

  projects.forEach((project) => {
    (project.documents ?? []).forEach((document) => {
      add({
        id: document.id,
        name: document.title,
        category: "document",
        summary: document.summary,
        details: [document.kind, project.title],
        layer: 3,
        cluster: domainForCategory(project.categories[0] ?? ""),
        importance: 2,
        domains: project.categories.map(domainForCategory),
        actions: [
          { label: "Read document", href: document.href, external: true },
          { label: "Download PDF", href: document.href, download: true },
          { label: "Open case study", href: `/projects/${project.slug}` },
        ],
      });
      link(document.id, project.slug, "document");
    });
  });

  const certificateHrefs = new Set(certificates.map((certificate) => certificate.href));
  experienceDocuments.forEach((document) => {
    // Same asset already exposed as a certificate node — avoid a duplicate graph record.
    if (certificateHrefs.has(document.href)) return;
    const cluster = experienceCluster[document.experienceId] ?? "software";
    add({
      id: document.id,
      name: document.title,
      category: "document",
      summary: `${document.org}. ${document.issued}. ${document.summary}`,
      details: [document.kind],
      layer: 3,
      cluster,
      importance: 2,
      domains: [cluster],
      actions: [
        { label: "View PDF", href: document.href, external: true },
        { label: "Download PDF", href: document.href, download: true },
        { label: "Open experience", href: `/experience#xp-${document.experienceId}` },
      ],
    });
    link(document.id, document.experienceId, "document");
    const org = orgId.get(document.org);
    if (org) link(document.id, org, "issued-by");
  });

  certificates.forEach((certificate) => {
    const skillLine = certificate.skills.length ? `Skills: ${certificate.skills.join(", ")}.` : "";
    const dateLine = certificate.date ?? "Completion date is not printed on the certificate.";
    add({
      id: certificate.id,
      name: certificate.name,
      category: "certificate",
      summary: `${certificate.issuer}. ${dateLine}`,
      details: [
        skillLine,
        certificate.credentialId ? `Credential ID: ${certificate.credentialId}.` : "",
        certificate.note ?? "",
      ].filter(Boolean),
      layer: 3,
      cluster: certificate.cluster,
      importance: 2,
      domains: certificate.domains,
      actions: [
        { label: "View Certificate", href: certificate.href, external: true },
        { label: "Download Certificate", href: certificate.href, download: true },
      ],
    });
    link(certificate.id, "domain-education", "credential");
    link(certificate.id, "vivek", "credential");
    if (certificate.domains.includes("education") || certificate.relatedNodeIds?.includes("djsce")) {
      link(certificate.id, "djsce", "credential");
    }
    certificate.skillIds.forEach((skillId) => link(certificate.id, skillId, "credential"));
    certificate.domains.forEach((domain) => {
      if (domain !== "education") link(certificate.id, `domain-${domain}`, "credential");
    });
    certificate.relatedNodeIds?.forEach((relatedId) => {
      if (relatedId !== "djsce") link(certificate.id, relatedId, "credential");
    });
  });

  add({
    id: "github-profile",
    name: "GitHub",
    category: "presence",
    summary: "Public repositories under vivek1918.",
    details: [],
    layer: 3,
    cluster: "software",
    importance: 2,
    domains: ["software"],
    actions: [{ label: "Open GitHub", href: profile.github, external: true }],
  });
  add({
    id: "linkedin-profile",
    name: "LinkedIn",
    category: "presence",
    summary: "Public profile linked from this site. The profile page itself was not available to read from here.",
    details: [],
    layer: 3,
    cluster: "software",
    importance: 2,
    domains: ["software"],
    actions: [{ label: "Open LinkedIn", href: profile.linkedin, external: true }],
  });
  link("github-profile", "vivek", "profile");
  link("linkedin-profile", "vivek", "profile");
  link("git", "github-profile", "profile");

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const projectOrder = new Map(projects.map((project, index) => [project.slug, index]));
  anchors.clear();

  const angleOf = (cluster: string) => {
    const index = Math.max(0, CLUSTERS.indexOf(cluster as (typeof CLUSTERS)[number]));
    return (index / CLUSTERS.length) * Math.PI * 2 - Math.PI / 2;
  };

  nodes.forEach((node) => {
    if (node.layer === 0) node.position = [0, 0.2, 0];
  });
  anchors.set("vivek", "vivek");

  CLUSTERS.forEach((cluster) => {
    const domain = byId.get(`domain-${cluster}`);
    if (!domain) return;
    const theta = angleOf(cluster);
    domain.position = [Math.cos(theta) * 4.6, Math.sin(theta * 2) * 1.35, Math.sin(theta) * 2.85];
    anchors.set(domain.id, "vivek");
  });

  CLUSTERS.forEach((cluster) => {
    const domain = byId.get(`domain-${cluster}`);
    const group = nodes
      .filter((node) => node.layer === 2 && node.cluster === cluster)
      .sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
    const length = Math.hypot(domain?.position[0] ?? 1, domain?.position[2] ?? 0) || 1;
    const ox = (domain?.position[0] ?? 1) / length;
    const oz = (domain?.position[2] ?? 0) / length;
    group.forEach((node, index) => {
      const column = index - (group.length - 1) / 2;
      const dist = 1.35 + (index % 2) * 0.48;
      const lift = ((index % 4) - 1.5) * 0.55;
      node.position = [
        (domain?.position[0] ?? 0) + ox * dist - oz * column * 0.58,
        (domain?.position[1] ?? 0) + lift,
        (domain?.position[2] ?? 0) + oz * dist + ox * column * 0.58,
      ];
      anchors.set(node.id, `domain-${cluster}`);
    });
  });

  const fan = (parent: UniverseNode, index: number, count: number): [number, number, number] => {
    const length = Math.hypot(parent.position[0], parent.position[2]) || 1;
    const ox = parent.position[0] / length;
    const oz = parent.position[2] / length;
    const column = index - (count - 1) / 2;
    const dist = 2.05 + (Math.abs(column) > 3 ? 0.75 : 0);
    return [
      parent.position[0] + ox * dist + -oz * column * 0.62,
      parent.position[1] + ((index % 5) - 2) * 0.48,
      parent.position[2] + oz * dist + ox * column * 0.62,
    ];
  };

  const linkedNodes = (node: UniverseNode) =>
    links
      .filter((link) => link.source === node.id || link.target === node.id)
      .map((link) => byId.get(link.source === node.id ? link.target : link.source))
      .filter((item): item is UniverseNode => Boolean(item));

  const outer = nodes.filter((node) => node.layer === 3);
  const groups = new Map<string, UniverseNode[]>();
  outer.forEach((node) => {
    let parentId = `domain-${node.cluster}`;
    if (node.cluster === "devops") parentId = "domain-devops";
    else if (node.category === "certificate") parentId = "djsce";
    else if (node.category === "presence") parentId = "vivek";
    else if (node.category === "document") {
      const experience = linkedNodes(node).find((item) => item.category === "experience");
      const research = linkedNodes(node).find((item) => item.category === "research");
      const project = linkedNodes(node).find((item) => item.category === "project");
      if (experience) parentId = experience.id;
      else if (research) parentId = research.id;
      else if (project) parentId = project.id;
    } else {
      const relatedProjects = linkedNodes(node)
        .filter((item) => item.category === "project")
        .sort((a, b) => (projectOrder.get(a.id) ?? 99) - (projectOrder.get(b.id) ?? 99));
      const relatedExperience = linkedNodes(node)
        .filter((item) => item.category === "experience")
        .sort((a, b) => b.importance - a.importance || a.id.localeCompare(b.id));
      const relatedResearch = linkedNodes(node).find((item) => item.category === "research");
      parentId = relatedProjects[0]?.id ?? relatedExperience[0]?.id ?? relatedResearch?.id ?? parentId;
    }
    anchors.set(node.id, parentId);
    const list = groups.get(parentId) ?? [];
    list.push(node);
    groups.set(parentId, list);
  });
  groups.forEach((group, parentId) => {
    const parent = byId.get(parentId);
    if (!parent) return;
    const ordered = [...group].sort((a, b) => a.name.localeCompare(b.name));
    ordered.forEach((node, index) => {
      if (parent.id === "vivek") {
        node.position = [index === 0 ? -2.3 : 2.3, 2.5, -1.4];
        return;
      }
      node.position = fan(parent, index, ordered.length);
    });
  });

  return { nodes, links };
}

const built = build();
export const universeNodes = built.nodes;
export const universeLinks = built.links;

export function universeNode(id: string) {
  return universeNodes.find((node) => node.id === id);
}

export function universeNeighbors(id: string) {
  return universeLinks
    .filter((link) => link.source === id || link.target === id)
    .map((link) => ({
      type: link.type,
      node: universeNode(link.source === id ? link.target : link.source),
    }))
    .filter((item): item is { type: string; node: UniverseNode } => Boolean(item.node));
}

export function universeParent(id: string) {
  const node = universeNode(id);
  if (!node || node.id === "vivek") return undefined;
  if (node.category === "domain") return "vivek";
  if (node.category === "experience") {
    const org = universeNeighbors(id).find((item) => item.node.category === "company");
    return org?.node.id ?? anchors.get(id) ?? `domain-${node.cluster}`;
  }
  if (node.category === "company" || node.category === "project" || node.category === "education" || node.category === "research") {
    return `domain-${node.cluster}`;
  }
  return anchors.get(id) ?? `domain-${node.cluster}`;
}

export function universeTrail(id: string) {
  const trail = [id];
  const seen = new Set<string>();
  while (trail[0] && trail[0] !== "vivek" && !seen.has(trail[0])) {
    seen.add(trail[0]);
    const parent = universeParent(trail[0]);
    if (!parent || parent === trail[0]) break;
    trail.unshift(parent);
  }
  if (trail[0] !== "vivek") trail.unshift("vivek");
  return trail.filter((item, index) => universeNode(item) && trail.indexOf(item) === index);
}

export function universeChildren(id: string) {
  const self = universeNode(id);
  if (!self) return [];
  const neighbors = universeNeighbors(id).map((item) => item.node);
  const unique = new Map<string, UniverseNode>();
  const keep = (node: UniverseNode) => {
    if (node.id !== self.id) unique.set(node.id, node);
  };
  if (self.category === "identity") neighbors.filter((node) => node.category === "domain").forEach(keep);
  else if (self.category === "domain") {
    universeNodes
      .filter((node) => node.layer === 2 && (node.cluster === self.cluster || node.domains.includes(self.cluster)))
      .forEach(keep);
    if (self.cluster === "devops") universeNodes.filter((node) => node.category === "skill" && node.cluster === "devops").forEach(keep);
  } else if (self.category === "company") neighbors.filter((node) => node.category === "experience").forEach(keep);
  else if (self.category === "experience") {
    neighbors.filter((node) => node.category === "project" || node.category === "skill" || node.category === "document").forEach(keep);
  } else if (self.category === "project") neighbors.filter((node) => node.category === "skill").forEach(keep);
  else if (self.category === "education") {
    neighbors.filter((node) => node.category === "certificate" || node.category === "experience" || node.category === "research").forEach(keep);
  } else if (self.category === "research") {
    neighbors.filter((node) => node.category === "skill" || node.category === "document").forEach(keep);
  } else if (self.category === "skill") {
    neighbors.filter((node) => node.category === "project" || node.category === "experience" || node.category === "research").forEach(keep);
  }
  return Array.from(unique.values()).sort((a, b) => b.importance - a.importance || a.name.localeCompare(b.name));
}

const filterCluster: Partial<Record<UniverseFilter, string>> = {
  "AI/ML": "aiml",
  Backend: "backend",
  DevOps: "devops",
  Education: "education",
};

function matchesFilter(node: UniverseNode, filter: UniverseFilter) {
  if (filter === "Projects") return node.category === "project";
  if (filter === "Skills") return node.category === "skill";
  if (filter === "Experience") return node.category === "experience" || node.category === "company";
  if (filter === "Research") {
    return node.category === "research" || node.id.includes("research-pdf") || (node.category === "document" && node.name.includes("Research Paper"));
  }
  if (filter === "Certifications") return node.category === "certificate";
  if (filter === "Documents") return node.category === "document";
  const cluster = filterCluster[filter];
  if (cluster) return node.cluster === cluster || node.domains.includes(cluster);
  return true;
}

export function universeDiscovered(expandedIds: Iterable<string>, pinnedIds: Iterable<string>) {
  const visible = new Set<string>(["vivek"]);
  CLUSTERS.forEach((cluster) => visible.add(`domain-${cluster}`));
  Array.from(pinnedIds).forEach((id) => {
    if (universeNode(id)) visible.add(id);
  });
  const expanded = new Set(expandedIds);
  let grew = true;
  while (grew) {
    grew = false;
    expanded.forEach((id) => {
      if (!visible.has(id)) return;
      universeChildren(id).forEach((child) => {
        if (!visible.has(child.id)) {
          visible.add(child.id);
          grew = true;
        }
      });
    });
  }
  return visible;
}

export function universeProgressive(expandedIds: Iterable<string>, pinnedIds: Iterable<string>, filter: UniverseFilter) {
  const discovered = universeDiscovered(expandedIds, pinnedIds);
  if (filter === "All") return discovered;
  const kept = new Set<string>();
  discovered.forEach((id) => {
    const node = universeNode(id);
    if (!node) return;
    if (node.id === "vivek" || node.category === "domain" || matchesFilter(node, filter)) kept.add(id);
  });
  discovered.forEach((id) => {
    if (!kept.has(id)) return;
    const seen = new Set<string>();
    let parent = universeParent(id);
    while (parent && discovered.has(parent) && !seen.has(parent)) {
      seen.add(parent);
      kept.add(parent);
      parent = universeParent(parent);
    }
  });
  return kept;
}

export function universeVisible(filter: UniverseFilter) {
  if (filter === "All") return new Set(universeNodes.map((node) => node.id));
  const ids = new Set<string>(["vivek"]);
  universeNodes.forEach((node) => {
    if (filter === "Projects" && node.category === "project") ids.add(node.id);
    if (filter === "Skills" && node.category === "skill") ids.add(node.id);
    if (filter === "Experience" && (node.category === "experience" || node.category === "company")) ids.add(node.id);
    if (filter === "AI/ML" && node.domains.includes("aiml")) ids.add(node.id);
    if (filter === "Backend" && node.domains.includes("backend")) ids.add(node.id);
    if (filter === "DevOps" && node.domains.includes("devops")) ids.add(node.id);
    if (filter === "Education" && (node.category === "education" || node.domains.includes("education"))) ids.add(node.id);
    if (filter === "Research" && (node.category === "research" || (node.category === "document" && node.name.toLowerCase().includes("research")))) {
      ids.add(node.id);
    }
    if (filter === "Certifications" && node.category === "certificate") ids.add(node.id);
    if (filter === "Documents" && node.category === "document") ids.add(node.id);
  });
  return ids;
}

export function searchUniverse(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const tokens = needle.split(/[^a-z0-9]+/).filter(Boolean);
  return universeNodes
    .map((node) => {
      const name = node.name.toLowerCase();
      const summary = node.summary.toLowerCase();
      const details = node.details.join(" ").toLowerCase();
      const haystack = `${name} ${summary} ${details} ${node.category}`;
      const phraseHit = haystack.includes(needle);
      const tokenHit = tokens.length > 0 && tokens.every((token) => haystack.includes(token));
      if (!phraseHit && !tokenHit) return null;
      let score = 0;
      if (name === needle) score += 100;
      if (name.includes(needle)) score += 40;
      if (tokenHit) score += 20 + tokens.length * 5;
      if (node.category === "research") score += 25;
      if (summary.includes(needle)) score += 10;
      if (details.includes(needle)) score += 5;
      return { node, score };
    })
    .filter((item): item is { node: UniverseNode; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name))
    .slice(0, 12)
    .map((item) => item.node);
}

export function validateUniverse() {
  const issues: string[] = [];
  const ids = new Set<string>();
  universeNodes.forEach((node) => {
    if (ids.has(node.id)) issues.push(`Duplicate id ${node.id}`);
    ids.add(node.id);
    if (node.position.some((value) => !Number.isFinite(value))) issues.push(`Bad position ${node.id}`);
    node.actions.forEach((action) => {
      if (!action.href) issues.push(`Missing URL on ${node.id}`);
      if (
        node.category === "document" &&
        (action.href.startsWith("/documents/") || action.href.startsWith("/research/")) &&
        !action.href.endsWith(".pdf")
      ) {
        issues.push(`Invalid document path ${action.href}`);
      }
      if (node.category === "certificate" && action.href.startsWith("/certificates/") && !action.href.match(/\.(pdf|jpg|jpeg|png|webp)$/i)) {
        issues.push(`Invalid certificate path ${action.href}`);
      }
    });
  });
  universeLinks.forEach((link) => {
    if (!ids.has(link.source) || !ids.has(link.target)) issues.push(`Broken link ${link.source} -> ${link.target}`);
  });
  return issues;
}

const issues = validateUniverse();
if (issues.length) {
  throw new Error(`Universe graph is inconsistent:\n${issues.join("\n")}`);
}
