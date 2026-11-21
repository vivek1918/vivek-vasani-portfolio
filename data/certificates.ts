export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  date: string | null;
  href: string;
  fileId: string;
  note?: string;
};

/**
 * Add certificates here. `date` stays null until a completion date is verified.
 * `fileId` is the Google Drive file id used for the preview thumbnail.
 * Do not add entries that are not backed by a real document.
 */
export const certificates: Certificate[] = [
  {
    id: "altair-ml",
    name: "Machine Learning Master Certification",
    issuer: "Altair RapidMiner",
    date: null,
    href: "https://drive.google.com/file/d/1gYT0xKwss4qbEWm5oK0soTlYcGvPbwjV/view?usp=sharing",
    fileId: "1gYT0xKwss4qbEWm5oK0soTlYcGvPbwjV",
  },
  {
    id: "google-python",
    name: "Crash Course on Python",
    issuer: "Google · Coursera",
    date: null,
    href: "https://drive.google.com/file/d/1hYjLf5Ptkhj7a400ENI7E3lWnjf8mz6T/view?usp=sharing",
    fileId: "1hYjLf5Ptkhj7a400ENI7E3lWnjf8mz6T",
  },
];

export const certificateFolder =
  "https://drive.google.com/drive/folders/1pmmDCZQDR0_1fHMtVW_2kx6xHpVQdKj8?usp=sharing";
