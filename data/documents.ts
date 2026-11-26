export type ExperienceDocument = {
  id: string;
  experienceId: string;
  org: string;
  title: string;
  kind: string;
  issued: string;
  summary: string;
  href: string;
};

/**
 * Original PDFs copied into public/documents. Text here is only what those files state.
 */
export const experienceDocuments: ExperienceDocument[] = [
  {
    id: "programmatix-lor",
    experienceId: "programmatix",
    org: "Programmatix Institute",
    title: "Letter of Recommendation",
    kind: "Letter",
    issued: "9 June 2025",
    summary:
      "Signed by Pratik Upadhya, Founder. The letter describes examination operations work and states that the internship has run since 24 November 2024.",
    href: "/documents/programmatix-letter-of-recommendation.pdf",
  },
  {
    id: "iit-patna-certificate",
    experienceId: "iitp",
    org: "Indian Institute of Technology (IIT) Patna",
    title: "Internship Completion Certificate",
    kind: "Certificate",
    issued: "11 June 2025",
    summary:
      "The certificate says the IITP internship ran from 17 March 2025 to 11 June 2025 and names contributions to ML for Network Security and Seating Arrangement.",
    href: "/documents/iit-patna-internship-completion-certificate.pdf",
  },
  {
    id: "webxela-certificate",
    experienceId: "webxela",
    org: "WEBXELA",
    title: "Certificate of Internship",
    kind: "Certificate",
    issued: "3 June 2024 – 3 September 2024",
    summary:
      "Certificate for the UI/UX Designing internship, signed by Yatharth Chauhan, Founder. The same page also prints Best Award.",
    href: "/documents/webxela-ui-ux-internship-certificate.pdf",
  },
  {
    id: "webxela-lor",
    experienceId: "webxela",
    org: "WEBXELA",
    title: "Letter of Recommendation",
    kind: "Letter",
    issued: "30 September 2024",
    summary:
      "Signed by Yatharth Chauhan, Founder. It recommends Vivek Chetan Vasani for the WEBXELA internship from 3 June 2024 to 3 September 2024.",
    href: "/documents/webxela-letter-of-recommendation.pdf",
  },
  {
    id: "ecell-campus-ambassador-certificate",
    experienceId: "ecell",
    org: "E-Cell, IIT Bombay",
    title: "Completion Certificate",
    kind: "Certificate",
    issued: "Date not printed on the certificate",
    summary:
      "Certificate of Completion for successfully completing the E-Cell IIT Bombay Campus Ambassador Internship Program 2024. Physics Wallah presents. Signed by Rashmi Khetan and Amey Patil, Overall Coordinators, E-Cell, IIT Bombay.",
    href: "/certificates/e-cell-iit-bombay-campus-ambassador.pdf",
  },
];

export function documentsFor(experienceId: string) {
  return experienceDocuments.filter((document) => document.experienceId === experienceId);
}
