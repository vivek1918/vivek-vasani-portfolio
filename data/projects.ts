export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  categories: string[];
  stack: string[];
  github: string;
  repoName: string;
  demo: { href: string; label: string } | null;
  featured: boolean;
  layout: "feature" | "split" | "band";
  index: string;
  overview: string;
  problem: string;
  why: string;
  contribution: string;
  features: string[];
  challenges: string[];
  implementation: string[];
  architecture: { nodes: ArchitectureNode[]; edges: [string, string][] } | null;
};

export const projectCategories = [
  "AI / ML",
  "Backend",
  "Full Stack",
  "Data Analytics",
  "Automation",
] as const;

export const projects: Project[] = [
  {
    slug: "physioplay",
    title: "PhysioPlay",
    summary: "A case-based physiotherapy chatbot that retrieves a patient scenario and answers in character through Groq.",
    categories: ["AI / ML"],
    stack: ["Python", "FastAPI", "Streamlit", "LangChain", "Groq", "FAISS", "Hugging Face"],
    github: "https://github.com/vivek1918/PhysioPlay1",
    repoName: "PhysioPlay1",
    demo: null,
    featured: true,
    layout: "feature",
    index: "01",
    overview:
      "PhysioPlay is a training-style chatbot for physiotherapy cases. A case file is embedded, retrieved, and used as the context for a Groq model that stays in the role of the patient. My resume describes it as a Mozilla-sponsored pilot used with 10 people.",
    problem:
      "Reading a case on paper does not feel like interviewing a patient. The useful version has to answer questions from the case, and it has to refuse to hand over the diagnosis when someone asks for it directly.",
    why: "I wanted a small clinical conversation loop: a source of truth for the case, retrieval so the model stays on that case, and a guard so the learning moment is not skipped.",
    contribution:
      "The public repository is my fork of buddhadevyash/PhysioPlay. The code there is the implementation I point to: a FastAPI service and a Streamlit interface over the same retrieval pattern. I am not presenting the upstream Vercel deployment as my own live demo.",
    features: [
      "Random selection of a JSON physiotherapy case.",
      "Embeddings of the case stored in a FAISS index.",
      "A LangChain retrieval chain in front of ChatGroq.",
      "A diagnostic-question filter that answers with a patient-style deflection instead of the diagnosis.",
      "A Streamlit chat layout and a FastAPI entrypoint in the same repository.",
    ],
    challenges: [
      "The patient role collapses if the model quotes the diagnosis. The code checks the question against diagnostic patterns before it answers.",
      "Each session has to remember whether the case is loaded, whether the user is ready, and whether the diagnosis has already been revealed.",
      "The same interaction exists as both a Streamlit app and a FastAPI app, so the behavior had to stay consistent across two entrypoints.",
    ],
    implementation: [
      "ppv01.py is the Streamlit client. It reads the Groq key from Streamlit secrets and builds a FAISS store from the selected case JSON.",
      "back.py is the FastAPI application. It uses the same LangChain pieces: HuggingFace embeddings, FAISS, a stuff-documents chain, and ChatGroq.",
      "Case files live in a JSON folder. One file is chosen at random and turned into the retrieval corpus for that session.",
      "There is no separate hosted demo I can verify as mine. The GitHub repository is the source of truth.",
    ],
    architecture: {
      nodes: [
        { id: "case", label: "Case JSON", detail: "Physiotherapy scenarios stored as JSON files and chosen at random for a session." },
        { id: "embed", label: "Embeddings", detail: "HuggingFace embeddings encode the selected case." },
        { id: "faiss", label: "FAISS", detail: "An in-memory FAISS index holds that case for retrieval." },
        { id: "api", label: "FastAPI / Streamlit", detail: "back.py serves the FastAPI app. ppv01.py is the Streamlit chat UI." },
        { id: "guard", label: "Diagnosis guard", detail: "Regex patterns catch diagnostic questions and return an in-character deflection." },
        { id: "llm", label: "Groq", detail: "ChatGroq, through a LangChain retrieval chain, writes the patient reply from retrieved context." },
      ],
      edges: [
        ["case", "embed"],
        ["embed", "faiss"],
        ["api", "guard"],
        ["guard", "faiss"],
        ["faiss", "llm"],
        ["llm", "api"],
      ],
    },
  },
  {
    slug: "socialpulse",
    title: "SocialPulse",
    summary: "A social analytics dashboard and RAG assistant over Reddit posts, built in the SimPPL research-engineering repository.",
    categories: ["AI / ML", "Full Stack"],
    stack: ["Next.js", "FastAPI", "Groq", "Sentence Transformers", "Pandas", "Plotly"],
    github: "https://github.com/vivek1918/research-engineering-intern-assignment",
    repoName: "research-engineering-intern-assignment",
    demo: {
      href: "https://drive.google.com/file/d/1oS7tTE8HxTOBaMxCCnjbgv4onOI8FynV/view?usp=sharing",
      label: "Demo recording",
    },
    featured: true,
    layout: "split",
    index: "02",
    overview:
      "SocialPulse analyzes Reddit content for engagement, sentiment, influential users, and topics, and lets someone ask questions about that data in natural language. The public repo is my fork of SimPPL’s research-engineering assignment, which lines up with my AI/ML fellowship there.",
    problem:
      "A folder of social posts is hard to read as a product. The useful version is a dashboard for the trends and a way to ask a question without writing the query by hand.",
    why: "During the SimPPL fellowship I was working on NLP and LLM systems. SocialPulse is the public project where that shows up as analytics plus retrieval, rather than as a single chat box.",
    contribution:
      "I maintain the fork and I list the project on my resume. The commit history on the repository also includes other contributors, so I describe the system as it is published rather than claiming every module as solo work.",
    features: [
      "Dashboard views for posts, engagement, sentiment, influential users, and keywords, as documented in the README.",
      "A RAG assistant that answers questions about the social dataset and can describe charts.",
      "Parsing of Reddit JSONL into posts and comments.",
      "Embeddings with sentence-transformers and nearest-neighbor retrieval.",
      "A recorded walkthrough linked from the README. It is a video, not a public web app I can verify as always on.",
    ],
    challenges: [
      "Social text is messy. The README describes a heuristic sentiment pass plus an LLM fallback for keywords, instead of one model doing every job.",
      "The assistant has to stay on the dataset. Retrieval is the constraint: embeddings first, then Groq.",
      "The repo is a shared fork. I keep the case study tied to the files and the README, not to an imagined split of ownership.",
    ],
    implementation: [
      "backend/app/main.py is the FastAPI entry. Surrounding modules cover dashboard, reports, routing, clustering queries, and generate_embeddings.py.",
      "The frontend is a Next.js app with a line-chart component and dashboard routes.",
      "requirements include FastAPI, Groq, Pandas, and Plotly. The README names all-MiniLM-L6-v2 for embeddings and LLaMA 3.3 / 3.1 through Groq.",
      "The README also documents a NewsAPI integration with in-memory caching. I treat that as documented behavior of this repository.",
    ],
    architecture: {
      nodes: [
        { id: "jsonl", label: "Reddit JSONL", detail: "Raw posts and comments parsed into separate records." },
        { id: "embed", label: "Embeddings", detail: "generate_embeddings.py and sentence-transformers build vectors for retrieval." },
        { id: "api", label: "FastAPI", detail: "main.py plus dashboard, report, routing, and cluster-query modules." },
        { id: "llm", label: "Groq", detail: "LLaMA models answer from retrieved context, as specified in the README." },
        { id: "ui", label: "Next.js", detail: "Dashboard UI, including a line chart, talking to the API." },
      ],
      edges: [
        ["jsonl", "embed"],
        ["embed", "api"],
        ["api", "llm"],
        ["llm", "api"],
        ["api", "ui"],
      ],
    },
  },
  {
    slug: "graphmind",
    title: "GraphMind",
    summary: "A semantic knowledge engine that turns documents into a graph and answers with hybrid retrieval.",
    categories: ["AI / ML", "Backend"],
    stack: ["Python", "FastAPI", "Neo4j", "Apache Jena Fuseki", "Redis", "LangChain", "FAISS"],
    github: "https://github.com/vivek1918/GraphyRAG",
    repoName: "GraphyRAG",
    demo: null,
    featured: true,
    layout: "band",
    index: "03",
    overview:
      "GraphMind is my name for the GraphyRAG repository: a pipeline that reads documents, resolves mentions, writes a knowledge graph, and retrieves with both vectors and the graph. It is an original repository, not a fork.",
    problem:
      "Search over files finds passages. It does not tell you that two mentions are the same person, or that a skill is tied to a job. That structure has to be extracted and stored on purpose.",
    why: "I wanted retrieval that can follow a relationship, not only a similar paragraph. The graph is the part a vector index cannot replace.",
    contribution:
      "I built this repository. The module layout — extraction, coreference, triple building, Neo4j, Fuseki, retrievers, and the FastAPI server — is the architecture of the project.",
    features: [
      "Document parsing for PDF, DOCX, and HTML, with OCR and audio libraries in the dependency set.",
      "Entity and relation extraction, plus a coreference resolver that clusters mentions.",
      "Triples written for Neo4j and for a Jena Fuseki SPARQL dataset.",
      "Vector, graph, hybrid, and multimodal retrievers behind one query API.",
      "Docker Compose for Neo4j, Fuseki, and Redis.",
    ],
    challenges: [
      "Mentions like “she” or a repeated name have to collapse onto one entity or the graph splinters. extract/coref.py is the module that clusters them.",
      "A single store was the wrong shape. Vectors answer similarity. The graph answers structure. The API exposes both, and a hybrid of the two.",
      "Multimodal inputs widen the failure surface. The dependency list includes PaddleOCR, Tesseract, and Whisper so images and audio can enter the same pipeline as text.",
    ],
    implementation: [
      "extract/coref.py defines CoreferenceResolver. It groups entities and builds same-as links.",
      "kg/build_triples.py, kg/neo4j_client.py, and kg/fuseki_client.py are the graph side. SPARQL examples live under kg/queries.",
      "rag/retrievers.py defines VectorRetriever, GraphRetriever, HybridRetriever, and MultiModalRetriever. rag/graph_rag.py sits above them.",
      "server/api.py is a FastAPI app titled Semantic Knowledge Graph API. Query requests choose a retriever type: vector, graph, hybrid, or multimodal.",
      "docker-compose.yml runs Fuseki on 3030, Neo4j on 7474/7687, and Redis on 6379.",
    ],
    architecture: {
      nodes: [
        { id: "docs", label: "Documents", detail: "PDF, DOCX, HTML, and — via the installed OCR and Whisper libraries — images and audio." },
        { id: "extract", label: "Extract", detail: "Entities, relations, and coreference clusters from extract/coref.py." },
        { id: "graph", label: "Neo4j + Fuseki", detail: "Property graph plus a SPARQL dataset. Both clients are in the kg package." },
        { id: "index", label: "Vector index", detail: "FAISS and Chroma are in the requirements. DocumentIndexer feeds the vector retriever." },
        { id: "retrieve", label: "Hybrid retrieval", detail: "Vector, graph, hybrid, and multimodal retrievers." },
        { id: "api", label: "FastAPI", detail: "server/api.py accepts a query and a retriever type and returns a structured response." },
      ],
      edges: [
        ["docs", "extract"],
        ["extract", "graph"],
        ["docs", "index"],
        ["graph", "retrieve"],
        ["index", "retrieve"],
        ["retrieve", "api"],
      ],
    },
  },
  {
    slug: "fintech-analytics",
    title: "FinTech Analytics Pro",
    summary: "A lending analytics workflow: SQLite schema, ETL, SQL utilities, and a recorded dashboard walkthrough.",
    categories: ["Data Analytics"],
    stack: ["Python", "SQLite", "Pandas", "Streamlit", "Plotly"],
    github: "https://github.com/vivek1918/FinTech_Analytics_Pro",
    repoName: "FinTech_Analytics_Pro",
    demo: {
      href: "https://drive.google.com/file/d/1M5IzvqScWU3Z0l1pDqbl_N9lSrbczeXm/view?usp=sharing",
      label: "Demo recording",
    },
    featured: true,
    layout: "split",
    index: "04",
    overview:
      "FinTech Analytics Pro is a data project for a lending portfolio. The repository contains the schema, the load path, query helpers, and a menu runner. The README documents a Streamlit dashboard, and a screen recording is published on Google Drive.",
    problem:
      "Portfolio questions — exposure, risk band, what a segment has borrowed — are awkward to answer from loose files. They need a schema and queries someone can re-run.",
    why: "I wanted the analytics to be inspectable: tables with names, SQL you can read, and a small runner instead of a one-off notebook.",
    contribution:
      "This is my repository. I wrote the schema, ETL, query utilities, and the project runner that are in the public tree.",
    features: [
      "A SQLite schema whose first tables are customers and loans, including credit score, income, risk band, and repayment fields.",
      "An ETL script and a setup script, launched from run_simple.py.",
      "SQL helpers in sqlite_queries.py.",
      "Pipeline monitoring and an ETL report artifact.",
      "A README walkthrough of portfolio, risk, and segmentation questions, plus a Drive recording.",
    ],
    challenges: [
      "The sample questions in the README, such as risk-adjusted return by risk band, need payments and loans in the same query. The schema has to carry both the loan and what has already been paid.",
      "SQLite keeps the project runnable without a hosted database. That also means skipping features SQLite does not have. The schema file says so directly.",
      "The runner’s dashboard action calls streamlit run simple_dashboard.py. I describe the dashboard from the README and the recording, and I point readers at the repository for the files that are actually checked in.",
    ],
    implementation: [
      "schema_design.sql creates the lending tables and indexes, starting with customers and loans.",
      "simple_setup.py and simple_etl.py prepare and load the database under database/fintech_portfolio.db.",
      "run_simple.py is a menu: setup, ETL, launch dashboard, or print table counts.",
      "Dependencies are pinned narrowly: pandas 2.1.3, numpy 1.24.3, streamlit 1.28.0, plotly 5.17.0.",
      "The demo link is a Google Drive recording from the README, not a hosted application.",
    ],
    architecture: {
      nodes: [
        { id: "src", label: "Source files", detail: "Inputs under data_sources, loaded by the ETL script." },
        { id: "etl", label: "ETL", detail: "simple_etl.py and simple_setup.py, with pipeline_monitoring.py beside them." },
        { id: "db", label: "SQLite", detail: "database/fintech_portfolio.db shaped by schema_design.sql." },
        { id: "sql", label: "SQL utilities", detail: "sqlite_queries.py and the sample analytical queries in the README." },
        { id: "ui", label: "Dashboard", detail: "The runner launches a Streamlit dashboard. The published demo is a Drive recording." },
      ],
      edges: [
        ["src", "etl"],
        ["etl", "db"],
        ["db", "sql"],
        ["sql", "ui"],
      ],
    },
  },
  {
    slug: "zomato-analysis",
    title: "Zomato Stock Analysis",
    summary: "Exploratory analysis and Prophet forecasts for Zomato’s open price, close price, and volume.",
    categories: ["Data Analytics"],
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Prophet", "Plotly"],
    github: "https://github.com/vivek1918/Zomato_Stock_Price_Analysis",
    repoName: "Zomato_Stock_Price_Analysis",
    demo: null,
    featured: true,
    layout: "band",
    index: "05",
    overview:
      "This notebook studies Zomato’s historical open, high, low, close, and volume. After the exploratory charts, it fits Facebook Prophet models and projects each series a year ahead.",
    problem:
      "A price history is not a forecast. Before modeling, the series has to be typed correctly, checked for gaps, and looked at — including the volume outliers — so the model is fitting the series you think it is.",
    why: "I wanted one notebook that shows the path from a raw market file to a forecast someone can look at, including the uncertainty band Prophet provides.",
    contribution: "The notebook and the CSV are in my repository. The forecasts for open, close, and volume are the models that are actually fit in the cells.",
    features: [
      "Datetime conversion and a missing-value check. The notebook records that the file had no missing values.",
      "Distribution plots and a note that volume has outliers, left in place because removing them needs a market judgment.",
      "Time plots of price and volume.",
      "Separate Prophet models for the opening price, the closing price, and volume.",
      "A 365-day future frame, with yhat, yhat_lower, and yhat_upper, plotted with Plotly.",
    ],
    challenges: [
      "The date column arrived as text. The series is unusable for Prophet until it is a real datetime named ds, with the target column named y.",
      "Volume outliers are visible on the box plot. The notebook keeps them and says why, instead of silently dropping them.",
      "Open, close, and volume do not share one model. Each series is fit on its own so the components plots stay readable.",
    ],
    implementation: [
      "The notebook imports Pandas, NumPy, Matplotlib, Seaborn, and Prophet.",
      "EDA cells cover dtypes, missing values, distributions, and outliers before any model is fit.",
      "model_open, model_close, and model_volume are each a Prophet() instance.",
      "make_future_dataframe(periods=365) builds the horizon. predict() returns the forecast table.",
      "plot_plotly and plot_components_plotly render the forecast and the seasonal components.",
    ],
    architecture: {
      nodes: [
        { id: "csv", label: "zomato.csv", detail: "Historical date, open, high, low, close, and volume." },
        { id: "eda", label: "EDA", detail: "Typing, missing values, distributions, outlier check, and time plots." },
        { id: "prophet", label: "Prophet", detail: "Three models: open, close, and volume." },
        { id: "forecast", label: "365-day forecast", detail: "yhat with lower and upper bounds, plus component plots." },
      ],
      edges: [
        ["csv", "eda"],
        ["eda", "prophet"],
        ["prophet", "forecast"],
      ],
    },
  },
  {
    slug: "document-verification",
    title: "Document Verification",
    summary: "Streamlit and FastAPI service that reads uploaded documents with OCR and returns structured JSON.",
    categories: ["AI / ML", "Backend"],
    stack: ["Python", "Streamlit", "FastAPI", "Mistral OCR"],
    github: "https://github.com/vivek1918/document_verification_system",
    repoName: "document_verification_system",
    demo: null,
    featured: false,
    layout: "split",
    index: "06",
    overview:
      "An application for automated document verification. It extracts, structures, and validates fields from uploads using Mistral OCR and an LLM, then emits a JSON summary. That description is the one published on the repository.",
    problem:
      "Documents arrive as files. Downstream systems want fields. The gap is extraction plus a check that the extraction is something you would actually pass on.",
    why: "I wanted the output to be a stable JSON object, not a paragraph, so another service could consume it.",
    contribution:
      "This is my repository. The public tree includes a Streamlit app, a FastAPI package, a verifier, an evaluation script, and tests.",
    features: [
      "Upload flow through the Streamlit app.",
      "OCR with Mistral, followed by LLM structuring, as stated in the repository description.",
      "A verifier module and an evaluation script.",
      "Standardized JSON summaries for more than one document type.",
      "A tests directory beside the pipeline.",
    ],
    challenges: [
      "OCR text is not the same thing as a trusted field. The verifier exists so extraction and acceptance are separate steps.",
      "Different document types cannot share one flat schema without losing information. The published design aims at a standardized JSON summary per document.",
      "A demo UI and an API need the same pipeline. app.py and the api package are both in the tree.",
    ],
    implementation: [
      "app.py is the Streamlit entry. run_pipeline.py runs the processing path.",
      "The api directory holds the FastAPI side. verifier/ holds the checks. evaluate.py scores outputs.",
      "ocr_outputs/ stores OCR artifacts. config.yml holds configuration.",
      "I am not adding a live demo link. None is published on the repository homepage.",
    ],
    architecture: {
      nodes: [
        { id: "upload", label: "Upload", detail: "Streamlit app.py receives the document." },
        { id: "ocr", label: "Mistral OCR", detail: "The repository description identifies Mistral as the OCR step. Artifacts land in ocr_outputs." },
        { id: "llm", label: "LLM structuring", detail: "Extracted text is turned into fields." },
        { id: "verify", label: "Verifier", detail: "verifier/ and evaluate.py check the structured result." },
        { id: "json", label: "JSON summary", detail: "A standardized object for whatever consumes the result. FastAPI exposes the pipeline." },
      ],
      edges: [
        ["upload", "ocr"],
        ["ocr", "llm"],
        ["llm", "verify"],
        ["verify", "json"],
      ],
    },
  },
  {
    slug: "device-monitoring",
    title: "Device Data Monitor",
    summary: "A Node.js service that ingests MQTT telemetry into InfluxDB, tracks device status in Redis, and serves aggregate APIs.",
    categories: ["Backend"],
    stack: ["Node.js", "Express", "MQTT", "InfluxDB", "Redis", "ExcelJS"],
    github: "https://github.com/vivek1918/Device-Data-Aggregation-Monitoring-System",
    repoName: "Device-Data-Aggregation-Monitoring-System",
    demo: null,
    featured: false,
    layout: "band",
    index: "07",
    overview:
      "A backend for device telemetry. Sensors publish JSON over MQTT. The service writes time-series points to InfluxDB, keeps ACTIVE or INACTIVE status in Redis, and exposes query and Excel export APIs.",
    problem:
      "Device payloads are frequent, small, and uneven. A request/response database is the wrong primary store, and a dashboard still needs aggregates rather than every raw point.",
    why: "I wanted the path from a sensor message to a queryable series to be explicit: validate, write, heartbeat, then aggregate on read.",
    contribution: "This is my repository. The README and the service files describe the flow below, and I am sticking to that.",
    features: [
      "MQTT subscriber on devicesIn/{deviceId}/data.",
      "InfluxDB writes using line protocol.",
      "Redis status for whether a device is active.",
      "REST APIs for raw points, operator stats, and dynamic aggregation.",
      "Excel exports through ExcelJS.",
      "Test publishers for numeric and string sensor payloads.",
    ],
    challenges: [
      "Payloads are not one shape. Normalization and field resolution sit in their own modules so a string device and a numeric device can share the pipeline.",
      "Status is not the same data as history. Redis holds the heartbeat. InfluxDB holds the series.",
      "Aggregates have to be computed from stored points, not assumed at ingest. operatorService and aggregationService do that work at read time.",
    ],
    implementation: [
      "mqttSubscriber.js validates the payload, writes Influx line protocol, and updates Redis.",
      "influx.js and redisClient.js are the clients. server.js mounts the Express app.",
      "routes/dataRoutes.js and routes/metaRoutes.js expose the API. services/ holds aggregation, caching, validation, and operator math.",
      "The README expects Node 18, InfluxDB on port 8086, Redis on 6379, and an MQTT broker on 1883.",
      "downloadReport.js and excelService.js build the .xlsx downloads.",
    ],
    architecture: {
      nodes: [
        { id: "device", label: "Device", detail: "Publishes JSON to devicesIn/{deviceId}/data." },
        { id: "mqtt", label: "MQTT subscriber", detail: "mqttSubscriber.js validates the message." },
        { id: "influx", label: "InfluxDB", detail: "Time-series store written in line protocol." },
        { id: "redis", label: "Redis", detail: "Device heartbeat and ACTIVE / INACTIVE status." },
        { id: "api", label: "Express API", detail: "Raw data, operator stats, aggregation, and Excel export." },
      ],
      edges: [
        ["device", "mqtt"],
        ["mqtt", "influx"],
        ["mqtt", "redis"],
        ["influx", "api"],
        ["redis", "api"],
      ],
    },
  },
  {
    slug: "seating-arrangement",
    title: "Exam Seating Arrangement",
    summary: "An allocator that seats an exam timetable into classrooms, with dense and sparse modes and explicit clash reporting.",
    categories: ["Automation"],
    stack: ["Python", "Pandas", "OpenPyXL"],
    github: "https://github.com/vivek1918/Optimizing_Seating_Arrangement",
    repoName: "Optimizing_Seating_Arrangement",
    demo: null,
    featured: false,
    layout: "split",
    index: "08",
    overview:
      "A Python allocator for exam seating. It reads the timetable, roll lists, and classroom inventory, then writes a seating plan. This is the public version of the seating algorithm from my IIT Patna internship.",
    problem:
      "Assigning students to rooms by hand breaks as soon as courses share a slot or a room runs out of buffer seats. The failures need to be visible, not hidden inside a spreadsheet.",
    why: "The internship asked for a seating method that used rooms more carefully. I wanted the rules — buffer, density, clashes — to be parameters, not one-off edits.",
    contribution:
      "I wrote the allocator in this repository. ExamSeatingArrangement in algo.py is the implementation. It supports the internship work described on my resume.",
    features: [
      "Dense or sparse seating, chosen when the allocator is constructed.",
      "A configurable buffer of seats held back in each room.",
      "Inputs for the exam schedule, course-to-roll mapping, roll-to-name mapping, and a classroom master.",
      "Outputs for seats still free and for clashes.",
      "Excel workbooks written with OpenPyXL, plus a temporary CSV of allocations.",
    ],
    challenges: [
      "Two courses in the same slot cannot quietly share a room in a way that puts the wrong students together. Clashes are collected instead of being overwritten.",
      "A room’s capacity is not the number of students you should place. The buffer argument keeps spare seats.",
      "Sparse and dense modes change how tightly the room is filled. They are modes of the same class, not two scripts.",
    ],
    implementation: [
      "algo.py defines ExamSeatingArrangement(buffer=1, mode='dense').",
      "cleaning.py and rollsorting.py prepare the spreadsheets before allocation.",
      "The class tracks exam_schedule, course_roll_mapping, roll_name_mapping, and classroom_master.",
      "Allocations are staged in temp_allocations.csv. seats_left and clashes are the exception reports.",
      "errors.txt receives the error log. Sample input and output workbooks are in the repository.",
    ],
    architecture: {
      nodes: [
        { id: "input", label: "Workbooks", detail: "Timetable, rolls, names, and the classroom master." },
        { id: "clean", label: "Cleaning", detail: "cleaning.py and rollsorting.py normalize the sheets." },
        { id: "alloc", label: "Allocator", detail: "ExamSeatingArrangement with a buffer and a dense or sparse mode." },
        { id: "out", label: "Plan + clashes", detail: "Seating workbook, seats left, and a clash list." },
      ],
      edges: [
        ["input", "clean"],
        ["clean", "alloc"],
        ["alloc", "out"],
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function relatedProjects(slug: string, limit = 2) {
  const current = getProject(slug);
  if (!current) return [];
  return projects
    .filter((project) => project.slug !== slug && project.categories.some((category) => current.categories.includes(category)))
    .slice(0, limit);
}
