"use client";

import { useState } from "react";
import { certificatePreviewSrc } from "@/data/certificate-previews";

export type CertificatePreviewProps = {
  href: string;
  title: string;
  fileType?: "pdf" | "image";
  /** Visual chrome for graph panel vs page cards. */
  variant?: "default" | "universe";
  className?: string;
  fallbackLabel?: string;
};

function inferFileType(href: string, fileType?: "pdf" | "image"): "pdf" | "image" {
  if (fileType) return fileType;
  const path = href.split("?")[0]?.toLowerCase() ?? "";
  if (/\.(png|jpe?g|webp|gif|avif)$/.test(path)) return "image";
  return "pdf";
}

/**
 * Shared landscape certificate thumbnail (16:9).
 * Prefers generated upright WebP previews so PDF /Rotate quirks and
 * baked-sideways Unstop exports render correctly. Media is absolutely
 * sized to the frame with object-fit: contain — no stretch, no crop,
 * and intrinsic image width cannot expand the card. Original files
 * are never modified.
 */
export function CertificatePreview({
  href,
  title,
  fileType,
  variant = "default",
  className = "",
  fallbackLabel = "Certificate",
}: CertificatePreviewProps) {
  const [failed, setFailed] = useState(false);
  const kind = inferFileType(href, fileType);
  const previewSrc = certificatePreviewSrc(href);
  const mediaSrc = previewSrc ?? (kind === "image" ? href : null);
  const shell = variant === "universe" ? "cert-preview cert-preview--universe" : "cert-preview";

  return (
    <div className={`${shell}${className ? ` ${className}` : ""}`.trim()}>
      {failed || !mediaSrc ? (
        <div className="cert-preview-fallback">
          <p className="kicker">{fallbackLabel}</p>
          <p className="cert-preview-fallback-title">{title}</p>
          {!mediaSrc ? (
            <p className="cert-preview-fallback-note">Preview unavailable — open the certificate to view.</p>
          ) : null}
        </div>
      ) : (
        // Local static assets under /public; next/image not required here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaSrc}
          alt={`${title} certificate`}
          className="cert-preview-media"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
