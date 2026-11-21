export const builds = [
  {
    id: "intelligent",
    title: "Intelligent applications",
    text: "Products where a model is behind a real task: a physiotherapy case, a question over a dataset, a document turned into fields.",
    project: "physioplay",
  },
  {
    id: "backend",
    title: "Backend services",
    text: "APIs with a clear ingest and read path. Device telemetry is the plainest example: MQTT in, InfluxDB and Redis in the middle, HTTP out.",
    project: "device-monitoring",
  },
  {
    id: "ai",
    title: "AI-powered products",
    text: "Retrieval in front of a generator. I would rather show the index and the guard than claim the model knows the answer.",
    project: "graphmind",
  },
  {
    id: "automation",
    title: "Automation systems",
    text: "Rules that replace a fragile manual pass. The exam seating allocator is that kind of system: buffer, density, and a clash list.",
    project: "seating-arrangement",
  },
  {
    id: "data",
    title: "Data-driven solutions",
    text: "A schema and a forecast you can re-run. FinTech Analytics is the schema. The Zomato notebook is the forecast.",
    project: "fintech-analytics",
  },
] as const;

export const philosophy = [
  "I trust a system I can draw. If I cannot point at the store, the retrieval step, and the thing the user actually touches, I do not understand it yet.",
  "A model is a component. The product is the data in front of it, the failure you can see, and the output a person can use.",
  "I would rather publish the repository, including its limits, than describe a platform that the code does not contain.",
];

export const interests = [
  { title: "Retrieval and knowledge graphs", detail: "FAISS when the unit is a passage. Neo4j and SPARQL when the unit is a relationship." },
  { title: "Backend shape", detail: "FastAPI and Spring Boot services where the route, the store, and the job are separate." },
  { title: "Automation that operators can run", detail: "Jenkins, Docker, and AWS when the task is infrastructure. Python when the task is a repeatable workflow." },
  { title: "Analysis with the method visible", detail: "Notebooks and SQL, with the cleaning step left in the file instead of summarized away." },
];
