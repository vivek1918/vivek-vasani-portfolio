export type Experience = {
  id: string;
  org: string;
  role: string;
  period: string;
  start: string;
  place: string;
  location: string | null;
  employmentType: string;
  workMode: string;
  current: boolean;
  summary: string;
  points: string[];
  technologies: string[];
  related: string[];
  projectLinks?: { label: string; href: string }[];
};

export const experiences: Experience[] = [
  {
    id: "veefin",
    org: "Veefin",
    role: "Software Engineer",
    period: "July 2026 – Present",
    start: "2026-07",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Full-time",
    workMode: "On-site",
    current: true,
    summary: "Current full-time software engineering role, on-site in Mumbai.",
    points: [],
    technologies: ["Java", "Spring Boot", "Backend Development", "Software Engineering"],
    related: [],
  },
  {
    id: "programmatix",
    org: "Programmatix Institute",
    role: "Examination Operations Intern",
    period: "December 2024 – Present",
    start: "2024-12",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Internship",
    workMode: "On-site",
    current: true,
    summary: "Leads examination operations, logistics, evaluation, and supervisor coordination for the institute.",
    points: [
      "Lead and manage examination operations, including scheduling, resource allocation, and performance monitoring of supervisors.",
      "Oversee logistics for on-campus and external examination centres, including secure handling and transportation of confidential materials under institutional policies.",
      "Coordinate with institute leadership, external universities, and partner colleges on examination activities.",
      "Manage evaluation, result tabulation, and data accuracy in performance tracking systems.",
      "Administer institutional payment collection and supervisor compensation, with attention to operational efficiency and academic integrity.",
    ],
    technologies: ["Team Management", "Leadership", "Operations Management", "Resource Allocation", "Process Management"],
    related: [],
  },
  {
    id: "veefin-intern",
    org: "Veefin",
    role: "Software Engineer Intern",
    period: "April 2026 – May 2026",
    start: "2026-04",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Internship",
    workMode: "On-site",
    current: false,
    summary: "A separate internship at Veefin, before the full-time Software Engineer role.",
    points: [],
    technologies: ["Java", "Spring Boot", "Backend Development"],
    related: [],
  },
  {
    id: "faclon",
    org: "Faclon Labs",
    role: "Backend Developer Intern",
    period: "March 2026",
    start: "2026-03",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Internship",
    workMode: "Hybrid",
    current: false,
    summary: "Backend internship on services for industrial IoT applications.",
    points: [
      "Contributed to scalable backend services for industrial IoT applications.",
      "Worked with MongoDB, Redis, RabbitMQ, and InfluxDB for storage, caching, messaging, and time-series data.",
      "Collaborated with the engineering team on backend workflows for real-time industrial data and analytics.",
    ],
    technologies: ["MongoDB", "Redis", "RabbitMQ", "InfluxDB", "Backend Development", "Industrial IoT"],
    related: [],
  },
  {
    id: "iitp",
    org: "Indian Institute of Technology (IIT) Patna",
    role: "Machine Learning Intern",
    period: "March 2025 – June 2025",
    start: "2025-03",
    place: "Remote",
    location: null,
    employmentType: "Internship",
    workMode: "Remote",
    current: false,
    summary: "Machine learning internship on multimodal classification and an examination seating algorithm.",
    points: [
      "Developed multimodal classification models using DRCNN, DGAN, and EMA-IDS, with a reported accuracy of 96–98%.",
      "Designed a custom algorithm to optimize examination seating arrangements, covering efficiency, monitoring, and resource allocation.",
      "Worked on machine learning research, algorithm design, and data-driven solutions for those problems.",
    ],
    technologies: ["Machine Learning", "Deep Learning", "Python", "DRCNN", "DGAN", "EMA-IDS", "Algorithm Design"],
    related: ["seating-arrangement"],
  },
  {
    id: "simppl",
    org: "SimPPL",
    role: "AI/ML Fellow",
    period: "February 2024 – April 2025",
    start: "2024-02",
    place: "New York, United States",
    location: "New York, United States",
    employmentType: "Fellowship / Internship",
    workMode: "Remote",
    current: false,
    summary: "Remote AI/ML fellowship with a New York organization, focused on NLP and language models.",
    points: [
      "Contributed to an open-source AI project involving NLP, large language models, and PyTorch.",
      "Translated AI/ML concepts into practical applications with a research-oriented engineering team.",
      "Worked on AI-driven development in natural language processing and intelligent applications.",
    ],
    technologies: ["Artificial Intelligence", "Machine Learning", "NLP", "Large Language Models", "PyTorch", "Research and Development"],
    related: ["physioplay", "socialpulse"],
    projectLinks: [
      {
        label: "PhysioPlay – View Project ↗",
        href: "https://nextgenai.simppl.org/physioplay",
      },
    ],
  },
  {
    id: "ecell",
    org: "E-Cell, IIT Bombay",
    role: "Campus Ambassador",
    period: "July 2024 – December 2024",
    start: "2024-07",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Internship / Campus Ambassador",
    workMode: "Remote",
    current: false,
    summary: "Campus ambassador for entrepreneurship programs at E-Cell, IIT Bombay.",
    points: [
      "Organized and promoted events, workshops, and competitions aimed at entrepreneurial thinking among students.",
      "Collaborated with the team on entrepreneurship initiatives, including connections with industry mentors, startups, and businesses.",
      "Managed promotional activity for those initiatives.",
    ],
    technologies: ["Team Management", "Event Management", "Communication", "Leadership", "Community Engagement"],
    related: [],
  },
  {
    id: "webxela",
    org: "WEBXELA",
    role: "UI/UX Designer",
    period: "June 2024 – September 2024",
    start: "2024-06",
    place: "Mumbai, Maharashtra, India",
    location: "Mumbai, Maharashtra, India",
    employmentType: "Internship",
    workMode: "Remote",
    current: false,
    summary: "UI/UX internship focused on interface design and collaboration with product teams.",
    points: [
      "Created interfaces with an emphasis on usability and visual clarity.",
      "Collaborated with cross-functional teams on digital product design.",
    ],
    technologies: ["UI/UX Design", "Figma", "Wireframing", "User Experience", "Interface Design"],
    related: [],
  },
];

export const experiencesByStart = [...experiences].sort((a, b) => a.start.localeCompare(b.start));
