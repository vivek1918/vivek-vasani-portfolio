"use client";

import { useState } from "react";
import type { Certificate } from "@/data/certificates";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [failed, setFailed] = useState(false);
  const preview = `https://drive.google.com/thumbnail?id=${certificate.fileId}&sz=w1000`;

  return (
    <article className="border border-[var(--line)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-raise)]">
        {failed ? (
          <div className="flex h-full flex-col justify-between p-6">
            <p className="kicker">Certificate</p>
            <p className="max-w-xs text-3xl tracking-[-0.04em]">{certificate.name}</p>
          </div>
        ) : (
          // Drive thumbnails are remote and may be blocked. The typographic card replaces a broken image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover object-top"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-2xl tracking-[-0.03em]">{certificate.name}</h3>
        <p className="mt-2 text-[var(--muted)]">{certificate.issuer}</p>
        <p className="mt-1 font-mono text-xs text-[var(--faint)]">{certificate.date ?? "Completion date not printed on the resume"}</p>
        <a className="btn-text mt-4" href={certificate.href} target="_blank" rel="noreferrer">
          <span>Open certificate</span>
        </a>
      </div>
    </article>
  );
}
