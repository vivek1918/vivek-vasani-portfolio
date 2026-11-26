import previewMap from "@/public/certificate-previews.json";

export type CertificatePreviewEntry = {
  preview: string;
  contentRotateCw?: number;
  view?: string;
  page?: number[];
  textLen?: number;
  pdfRotate?: number;
};

const map = previewMap as unknown as Record<string, CertificatePreviewEntry>;

/** Raster preview path for a certificate/document href, if generated. */
export function certificatePreviewSrc(href: string): string | undefined {
  const path = href.split("?")[0] ?? href;
  return map[path]?.preview;
}

/**
 * Href to open for "View Certificate".
 * Uses an upright high-res raster when the original PDF stores landscape
 * content sideways (Unstop/Media.net style). Otherwise the original file.
 */
export function certificateViewHref(href: string): string {
  const path = href.split("?")[0] ?? href;
  const entry = map[path];
  if (entry?.view) return entry.view;
  return href;
}

export function certificateNeedsOrientationFix(href: string): boolean {
  const path = href.split("?")[0] ?? href;
  return Boolean(map[path]?.contentRotateCw);
}
