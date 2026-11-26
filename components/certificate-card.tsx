"use client";

import type { Certificate } from "@/data/certificates";
import { CertificatePreview } from "@/components/certificate-preview";
import { certificateViewHref } from "@/data/certificate-previews";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const viewHref = certificateViewHref(certificate.href);

  return (
    <article className="cert-card">
      <CertificatePreview
        href={certificate.href}
        title={certificate.name}
        fileType={certificate.fileType}
      />
      <div className="cert-card-body">
        <h3 className="text-2xl tracking-[-0.03em]">{certificate.name}</h3>
        <p className="mt-2 text-[var(--muted)]">{certificate.issuer}</p>
        <p className="mt-1 font-mono text-xs text-[var(--faint)]">
          {certificate.date ?? "Completion date not printed on the certificate"}
        </p>
        {certificate.skills.length > 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">{certificate.skills.join(" · ")}</p>
        ) : null}
        <div className="cert-card-actions">
          <a className="btn-text" href={viewHref} target="_blank" rel="noreferrer">
            <span>View Certificate</span>
          </a>
          <a className="btn-text" href={certificate.href} download={certificate.fileName}>
            <span>Download Certificate</span>
          </a>
        </div>
      </div>
    </article>
  );
}
