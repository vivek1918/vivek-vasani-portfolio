export type Skill = {
  id: string;
  name: string;
  group: string;
  summary: string;
  usedFor: string;
  projects: string[];
  experience: string[];
};

export const skillGroups = [
  "Programming",
  "Backend",
  "AI / ML",
  "DevOps / Cloud",
  "Data / Analytics",
] as const;

export const skills: Skill[] = [
  {
    id: "python",
    name: "Python",
    group: "Programming",
    summary: "Primary language across AI applications, automation, and data work.",
    usedFor:
      "Services, notebooks, ETL, Jenkins utilities, and model pipelines. It shows up in PhysioPlay, GraphMind, FinTech Analytics, Zomato analysis, document verification, and the seating allocator.",
    projects: ["physioplay", "graphmind", "fintech-analytics", "zomato-analysis", "document-verification", "seating-arrangement"],
    experience: ["Veefin Solutions Limited", "SimPPL", "IIT Patna"],
  },
  {
    id: "java",
    name: "Java",
    group: "Programming",
    summary: "Used for Spring Boot MDM services.",
    usedFor: "Backend services at Veefin, alongside workflow, access-control, and API changes on the MDM platform.",
    projects: [],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "sql",
    name: "SQL",
    group: "Programming",
    summary: "Schema design and analytical queries over relational data.",
    usedFor:
      "The FinTech Analytics repository defines a SQLite lending schema and SQL utilities for portfolio questions. SQL is also a core resume skill.",
    projects: ["fintech-analytics"],
    experience: [],
  },
  {
    id: "c",
    name: "C",
    group: "Programming",
    summary: "Listed on my resume as a programming language.",
    usedFor: "Part of my programming foundation. I have not published a public project that is primarily written in C.",
    projects: [],
    experience: [],
  },
  {
    id: "cpp",
    name: "C++",
    group: "Programming",
    summary: "Listed on my resume as a programming language.",
    usedFor: "Part of my programming foundation. I have not published a public project that is primarily written in C++.",
    projects: [],
    experience: [],
  },
  {
    id: "spring",
    name: "Spring Boot",
    group: "Backend",
    summary: "Java services for platform and MDM work.",
    usedFor: "Veefin Chronicle and MDM services: workflows, access controls, and APIs.",
    projects: [],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "rest",
    name: "REST APIs",
    group: "Backend",
    summary: "HTTP APIs in front of models, graphs, and device data.",
    usedFor:
      "FastAPI surfaces in PhysioPlay, GraphMind, SocialPulse, and document verification. The device-monitoring service exposes REST endpoints over ingested telemetry.",
    projects: ["physioplay", "graphmind", "socialpulse", "document-verification", "device-monitoring"],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    group: "Backend",
    summary: "Python API layer for AI and data products.",
    usedFor:
      "PhysioPlay’s service, GraphMind’s knowledge-graph API, the SocialPulse backend, and the document verification API.",
    projects: ["physioplay", "graphmind", "socialpulse", "document-verification"],
    experience: [],
  },
  {
    id: "architecture",
    name: "Backend Architecture",
    group: "Backend",
    summary: "Splitting ingestion, retrieval, storage, and delivery into pieces that can be reasoned about.",
    usedFor:
      "GraphMind separates extraction, the graph store, retrievers, and the API. The device monitor separates MQTT ingestion, InfluxDB writes, Redis status, and query APIs.",
    projects: ["graphmind", "device-monitoring", "socialpulse"],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    group: "AI / ML",
    summary: "Models used when the problem is prediction, classification, or forecasting.",
    usedFor:
      "Classification work at IIT Patna, and Prophet forecasts for Zomato’s open price, close price, and volume.",
    projects: ["zomato-analysis", "seating-arrangement"],
    experience: ["IIT Patna", "SimPPL"],
  },
  {
    id: "dl",
    name: "Deep Learning",
    group: "AI / ML",
    summary: "Neural models for classification, listed through the IIT Patna internship.",
    usedFor:
      "The internship report names DRCNN, DGAN, and EMA-IDS as the classification algorithms I designed and optimized, with 96–98% accuracy recorded on my resume.",
    projects: [],
    experience: ["IIT Patna"],
  },
  {
    id: "nlp",
    name: "NLP",
    group: "AI / ML",
    summary: "Language understanding for chat, extraction, and retrieval.",
    usedFor:
      "Healthcare chatbots at SimPPL, entity and relation extraction in GraphMind, and the language layer of SocialPulse.",
    projects: ["graphmind", "socialpulse", "physioplay"],
    experience: ["SimPPL"],
  },
  {
    id: "cv",
    name: "Computer Vision",
    group: "AI / ML",
    summary: "A resume skill, with public work sitting closest to document and image understanding.",
    usedFor:
      "GraphMind’s dependency set includes OpenCV, PaddleOCR, and Tesseract for visual documents. Document verification uses Mistral OCR to pull structured fields from uploads.",
    projects: ["graphmind", "document-verification"],
    experience: [],
  },
  {
    id: "rag",
    name: "RAG",
    group: "AI / ML",
    summary: "Retrieval in front of a generator, so answers stay tied to a source.",
    usedFor:
      "PhysioPlay retrieves a physiotherapy case from FAISS before calling the model. SocialPulse retrieves embedded social data. GraphMind mixes vector retrieval with the knowledge graph.",
    projects: ["physioplay", "socialpulse", "graphmind"],
    experience: ["SimPPL"],
  },
  {
    id: "llm",
    name: "LLM Applications",
    group: "AI / ML",
    summary: "Products where a language model is part of the system, not the whole system.",
    usedFor:
      "PhysioPlay calls Groq through LangChain. SocialPulse’s README specifies Groq with LLaMA 3.3 / 3.1. GraphMind’s pipeline can use Groq during extraction.",
    projects: ["physioplay", "socialpulse", "graphmind", "document-verification"],
    experience: ["SimPPL"],
  },
  {
    id: "docker",
    name: "Docker",
    group: "DevOps / Cloud",
    summary: "Packaging services and local infrastructure.",
    usedFor:
      "Infrastructure automation at Veefin. GraphMind’s compose file runs Neo4j, Jena Fuseki, and Redis together.",
    projects: ["graphmind"],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "jenkins",
    name: "Jenkins",
    group: "DevOps / Cloud",
    summary: "Automation jobs around infrastructure and checks.",
    usedFor: "Python/Jenkins automation for infrastructure and security workflows at Veefin.",
    projects: [],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "aws",
    name: "AWS",
    group: "DevOps / Cloud",
    summary: "Cloud infrastructure used from automation workflows.",
    usedFor: "AWS is part of the infrastructure automation work at Veefin, together with Python, Jenkins, and Docker.",
    projects: [],
    experience: ["Veefin Solutions Limited"],
  },
  {
    id: "git",
    name: "Git",
    group: "DevOps / Cloud",
    summary: "Version control for every public project and for day-to-day engineering.",
    usedFor: "Public work is on github.com/vivek1918. Forty-four public repositories are listed there.",
    projects: [],
    experience: ["Veefin Solutions Limited", "SimPPL", "IIT Patna"],
  },
  {
    id: "pandas",
    name: "Pandas",
    group: "Data / Analytics",
    summary: "Tabular data cleaning and feature preparation.",
    usedFor: "Zomato stock analysis, the seating allocator’s spreadsheets, and the FinTech ETL scripts.",
    projects: ["zomato-analysis", "fintech-analytics", "seating-arrangement"],
    experience: [],
  },
  {
    id: "numpy",
    name: "NumPy",
    group: "Data / Analytics",
    summary: "Numerical work underneath the Python data stack.",
    usedFor: "Used with Pandas in the Zomato notebook and listed with the analytics libraries on my resume.",
    projects: ["zomato-analysis"],
    experience: [],
  },
  {
    id: "matplotlib",
    name: "Matplotlib",
    group: "Data / Analytics",
    summary: "Static charts for exploratory analysis.",
    usedFor: "Price and volume charts in the Zomato notebook.",
    projects: ["zomato-analysis"],
    experience: [],
  },
  {
    id: "seaborn",
    name: "Seaborn",
    group: "Data / Analytics",
    summary: "Statistical plots on top of Matplotlib.",
    usedFor: "Distribution and exploratory plots in the Zomato analysis.",
    projects: ["zomato-analysis"],
    experience: [],
  },
  {
    id: "powerbi",
    name: "Power BI",
    group: "Data / Analytics",
    summary: "Business intelligence tooling listed on my resume.",
    usedFor: "Listed with Tableau and the Python visualization stack. I have not published a public Power BI project.",
    projects: [],
    experience: [],
  },
  {
    id: "tableau",
    name: "Tableau",
    group: "Data / Analytics",
    summary: "Business intelligence tooling listed on my resume.",
    usedFor: "Listed with Power BI and the Python visualization stack. I have not published a public Tableau workbook.",
    projects: [],
    experience: [],
  },
];
