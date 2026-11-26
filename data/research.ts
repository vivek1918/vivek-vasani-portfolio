export type ResearchGraphConcept = {
  id: string;
  name: string;
  summary: string;
};

export type ResearchPaper = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  status: "Unpublished Research";
  statusLabel: "UNPUBLISHED RESEARCH";
  authors: string[];
  institution: string;
  guide?: string;
  abstract: string;
  summary: string;
  areas: string[];
  technologies: string[];
  methodologies: string[];
  reportedFindings: string[];
  pdfHref: string;
  pdfFileName: string;
  graphNodeId: string;
  graphPdfNodeId: string;
  relatedProjectIds?: string[];
  graphConcepts?: ResearchGraphConcept[];
  graphSkills?: string[];
};

/**
 * Academic research entries. Status labels are intentional: this work was written
 * as research but was never formally published (not IEEE / journal / conference / peer-reviewed)
 * unless a formal venue is explicitly stated in the source document.
 */
export const researchPapers: ResearchPaper[] = [
  {
    id: "graphmind",
    title: "GRAPHMIND: AI-DRIVEN SEMANTIC KNOWLEDGE GRAPH FROM UNSTRUCTURED DATA",
    shortTitle: "GRAPHMIND – Semantic Knowledge Graph Research",
    category: "Knowledge Graphs / GraphRAG",
    status: "Unpublished Research",
    statusLabel: "UNPUBLISHED RESEARCH",
    authors: ["Ashna Aglawe", "Moksh Vora", "Parth Gala", "Vivek Vasani"],
    institution: "Dwarkadas J. Sanghvi College of Engineering, Mumbai, India",
    guide: "Deepali Patil",
    abstract:
      "This unpublished academic research presents a complete Semantic Knowledge Graph (SKG) and GraphRAG pipeline that transforms heterogeneous document collections into a provenance-aware, queryable knowledge network. PDFs and plain text are ingested through extensible interfaces; NLP processes such as sentence segmentation, named entity recognition, entity linking, and relation extraction produce reified RDF triples with confidence, extraction method, and provenance. A dual knowledge store combines an RDF triple store (Apache Jena Fuseki / SPARQL) with Neo4j for property-graph visualization, while Sentence Transformers and FAISS support hybrid GraphRAG retrieval that mixes graph traversal with vector similarity. Dynamic OWL ontology evolution and SHACL validation keep the schema adaptable and structurally sound. Findings below are as stated in the research paper and are not independently verified benchmarks.",
    summary:
      "Unpublished academic research on building a Semantic Knowledge Graph and GraphRAG pipeline over unstructured documents, combining RDF/OWL, Neo4j, FAISS, and hybrid retrieval for explainable answers.",
    areas: [
      "Knowledge Graph Construction",
      "GraphRAG and Hybrid Retrieval",
      "Natural Language Processing",
      "Named Entity Recognition",
      "Entity Linking and Relation Extraction",
      "RDF and OWL",
      "Dynamic Ontology Evolution",
      "Provenance-aware Knowledge Representation",
      "SHACL Validation",
      "Semantic Search",
      "Multimodal Document Ingestion",
    ],
    technologies: [
      "Apache Jena Fuseki",
      "Neo4j",
      "FAISS",
      "Sentence Transformers",
      "all-MiniLM-L6-v2",
      "RDF/OWL",
      "SPARQL",
      "SHACL",
      "GraphRAG",
      "Groq (Llama 3.1 8B Instant)",
      "Streamlit",
      "Flask",
      "PyPDF2",
      "pdfplumber",
      "Whisper",
      "Tesseract",
      "EasyOCR",
      "PaddleOCR",
    ],
    methodologies: [
      "Multi-modal document ingestion and parsing",
      "Hybrid document classification (rule-based, keyword, and LLM validation)",
      "Schema-driven and NER-based entity extraction",
      "Pattern, proximity, and syntactic relation extraction",
      "Reified RDF triple construction with provenance",
      "Dynamic ontology evolution from observed instances",
      "Hybrid graph + vector GraphRAG retrieval",
      "SHACL validation and confidence-aware reranking",
    ],
    reportedFindings: [
      "On a Professional Resume corpus (9 documents) and Yoga Practice corpus (12 documents), the paper reports system averages of 16.7 entities per document, 87% precision, 83.5% recall, and 92% classification confidence.",
      "The paper reports 2,389 RDF triples generated across both corpora (1,247 resume; 1,142 yoga).",
      "Hybrid GraphRAG retrieval is reported at 84% top-3 accuracy with vector similarity weighted 0.6 and graph traversal 0.4 — described as a 12% improvement over vector-only retrieval.",
      "Resume Knowledge Graph analysis in the paper reports mean relationship confidence ≈ 0.6387 (std ≈ 0.00845), modularity Q = 0.67, and clustering index C = 0.82.",
      "Yoga Practice Knowledge Graph analysis in the paper reports mean relationship confidence ≈ 0.646 (std ≈ 0.0104) and nearly 94% ontological consistency using SHACL-based schema validation.",
    ],
    pdfHref: "/research/graphmind-research-paper.pdf",
    pdfFileName: "GRAPHMIND-AI-Driven-Semantic-Knowledge-Graph.pdf",
    graphNodeId: "graphmind-research",
    graphPdfNodeId: "graphmind-research-pdf",
    relatedProjectIds: ["graphmind"],
    graphConcepts: [
      {
        id: "graphrag",
        name: "GraphRAG",
        summary: "Hybrid graph-and-vector retrieval described in the GRAPHMIND research paper.",
      },
      {
        id: "knowledge-graphs",
        name: "Knowledge Graphs",
        summary: "Semantic knowledge-graph construction from unstructured documents in GRAPHMIND.",
      },
      {
        id: "rdf-owl",
        name: "RDF/OWL",
        summary: "Standards used in GRAPHMIND for reified triples, ontology evolution, and SPARQL querying.",
      },
      {
        id: "semantic-search",
        name: "Semantic Search",
        summary: "Hybrid semantic retrieval combining graph patterns with vector similarity in GRAPHMIND.",
      },
    ],
    graphSkills: ["NLP", "Neo4j", "FAISS", "Sentence Transformers", "Apache Jena Fuseki", "SPARQL", "SHACL"],
  },
  {
    id: "stable-diffusion-sdxl",
    title: "STABLE DIFFUSION: SCALING LATENT DIFFUSION MODELS FOR HIGH-RESOLUTION IMAGE SYNTHESIS",
    shortTitle: "Stable Diffusion XL – High-Resolution Image Synthesis",
    category: "Computer Vision / Generative AI",
    status: "Unpublished Research",
    statusLabel: "UNPUBLISHED RESEARCH",
    authors: ["Yash Buddhadev", "Vivek Vasani", "Shruti Dodani"],
    institution: "Dwarkadas J. Sanghvi College of Engineering",
    abstract:
      "This unpublished academic research benchmarks Stable Diffusion XL (stabilityai/stable-diffusion-xl-base-1.0) against leading GANs such as StyleGAN2 and BigGAN on high-resolution image synthesis. Using datasets including MS-COCO, FFHQ, and ImageNet, the paper evaluates FID, Inception Score, diversity/entropy, and computational cost. Findings below are as stated in the research paper and are not independently verified benchmarks. The document does not state IEEE, journal, conference, or peer-reviewed publication.",
    summary:
      "Unpublished computer-vision research comparing Stable Diffusion XL with StyleGAN2 and BigGAN on FID, diversity, training stability, and high-resolution image synthesis.",
    areas: [
      "Computer Vision",
      "Generative AI",
      "Latent Diffusion Models",
      "High-Resolution Image Synthesis",
      "Generative Adversarial Networks",
      "Text-to-Image Generation",
      "Model Evaluation (FID / IS)",
    ],
    technologies: [
      "Stable Diffusion XL",
      "stabilityai/stable-diffusion-xl-base-1.0",
      "StyleGAN2",
      "BigGAN",
      "Fréchet Inception Distance (FID)",
      "Inception Score (IS)",
      "MS-COCO",
      "FFHQ",
      "ImageNet",
    ],
    methodologies: [
      "Comparative evaluation of latent diffusion models versus GAN baselines",
      "Quantitative metrics: FID, Inception Score, entropy/diversity, FLOPs and training time",
      "Qualitative visual comparison of structural coherence, texture, lighting, and background integration",
      "Use of a pre-trained SDXL checkpoint alongside literature-supported StyleGAN2 and BigGAN benchmarks",
      "Conditional GAN reference implementation trained on Stanford Cars for qualitative comparison",
    ],
    reportedFindings: [
      "The paper reports SDXL FID of 5.2 on FFHQ at 1024×1024, compared with StyleGAN2 at 6.8 under the same setting.",
      "The paper reports higher diversity/entropy for SDXL (4.93) versus StyleGAN2 (4.12).",
      "The paper reports SDXL converging in approximately 250k training steps versus over 600k steps for high-resolution GAN outputs.",
      "The paper reports Inception Score of 9.87 on ImageNet for diffusion models (SDXL) versus 8.53 for GANs (StyleGAN2/BigGAN).",
      "Qualitative comparison in the paper describes stronger detail retention, lighting, structural coherence, and stylistic range for diffusion outputs relative to the GAN samples shown.",
    ],
    pdfHref: "/research/stable-diffusion-latent-diffusion-high-resolution-image-synthesis.pdf",
    pdfFileName: "Stable-Diffusion-Scaling-Latent-Diffusion-Models.pdf",
    graphNodeId: "sdxl-research",
    graphPdfNodeId: "sdxl-research-pdf",
    graphConcepts: [
      {
        id: "computer-vision",
        name: "Computer Vision",
        summary: "Vision and generative image-synthesis research domain for the Stable Diffusion XL paper.",
      },
      {
        id: "diffusion-models",
        name: "Diffusion Models",
        summary: "Latent diffusion generative modeling evaluated in the Stable Diffusion XL research paper.",
      },
      {
        id: "gans",
        name: "Generative Adversarial Networks",
        summary: "StyleGAN2 and BigGAN baselines compared against SDXL in the research paper.",
      },
      {
        id: "high-res-image-synthesis",
        name: "High-Resolution Image Synthesis",
        summary: "1024×1024 image generation evaluation setting described in the Stable Diffusion research paper.",
      },
    ],
    graphSkills: ["Computer Vision", "Stable Diffusion XL", "PyTorch", "Deep Learning"],
  },
];

export function researchById(id: string) {
  return researchPapers.find((paper) => paper.id === id);
}

export const primaryResearch = researchPapers[0];
