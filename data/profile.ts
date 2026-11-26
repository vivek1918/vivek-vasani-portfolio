export const profile = {
  name: "Vivek Vasani",
  monogram: "VV.",
  role: "Software Developer",
  location: "Mumbai, India",
  email: "vivekvasani2004@gmail.com",
  phone: "+91-8928728688",
  phoneHref: "tel:+918928728688",
  github: "https://github.com/vivek1918",
  githubUser: "vivek1918",
  linkedin: "https://www.linkedin.com/in/vivek-vasani-93240228a/",
  /**
   * Flip `open` and edit `label` to change the hero status.
   * This is manual — it is not inferred from a job board.
   */
  availability: {
    open: true,
    label: "Open to opportunities",
  },
  resumeFile: "/resume/Vivek_Vasani_Resume.pdf",
  brandLine: "Building intelligent systems. Engineering real solutions.",
  heroLines: ["Engineering ideas", "into intelligent", "products."],
  heroIntro:
    "I'm Vivek Vasani — a software developer working across backend engineering, AI-powered applications, and intelligent systems.",
  summary:
    "I work across AI/ML and software engineering, with a practical base in Python, SQL, and Java/Spring Boot. My projects and roles sit in backend services, data analysis, and AI-assisted products, with cloud tooling and automation used where they make the system easier to run.",
  education: {
    degree: "B.Tech in Artificial Intelligence & Data Science",
    school: "Dwarkadas J. Sanghvi College of Engineering",
    period: "2022 – 2026",
    cgpa: "8.51",
  },
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
