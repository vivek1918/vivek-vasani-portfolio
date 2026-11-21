export type Experience = {
  id: string;
  org: string;
  role: string;
  period: string;
  place: string;
  summary: string;
  points: string[];
  technologies: string[];
  related: string[];
};

export const experiences: Experience[] = [
  {
    id: "veefin",
    org: "Veefin Solutions Limited",
    role: "Engineer",
    period: "April 2026 – Present",
    place: "Professional experience",
    summary:
      "Working across the DevOps, Commons, and MDM teams on automation, platform development, and backend services.",
    points: [
      "Built Python and Jenkins automation using AWS and Docker for infrastructure and security workflows.",
      "Enhanced Veefin Chronicle and the Java/Spring Boot MDM services.",
      "Improved workflows, access controls, and APIs on those platform services.",
    ],
    technologies: ["Python", "Jenkins", "AWS", "Docker", "Java", "Spring Boot"],
    related: [],
  },
  {
    id: "simppl",
    org: "SimPPL",
    role: "AI/ML Fellow",
    period: "February 2024 – March 2025",
    place: "Fellowship",
    summary:
      "Built intelligent NLP and LLM-based chatbots for healthcare, and contributed to open-source AI systems during the fellowship.",
    points: [
      "Developed NLP and LLM-based chatbots aimed at healthcare conversations and strategy execution.",
      "Designed models with attention to accuracy and real-time response behavior.",
      "Contributed to open-source work by tightening how the AI systems behaved.",
      "SocialPulse, the public analytics project, lives in a fork of SimPPL’s research-engineering assignment.",
    ],
    technologies: ["Python", "NLP", "LLMs", "RAG"],
    related: ["socialpulse"],
  },
  {
    id: "iitp",
    org: "Indian Institute of Technology, Patna",
    role: "Machine Learning Intern",
    period: "March 2025 – June 2025",
    place: "Internship",
    summary:
      "Designed classification models and an exam seating algorithm during a machine learning internship.",
    points: [
      "Designed and optimized the classification algorithms DRCNN, DGAN, and EMA-IDS. My resume reports 96–98% accuracy on that work.",
      "Built an exam seating arrangement algorithm to improve allocation efficiency and use of rooms.",
      "The seating work is published as Optimizing Seating Arrangement, with dense and sparse modes, buffer seats, and clash reporting.",
    ],
    technologies: ["Python", "Machine Learning", "Deep Learning", "Pandas"],
    related: ["seating-arrangement"],
  },
];
