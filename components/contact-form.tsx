"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/profile";

type Status = "idle" | "sending" | "sent" | "error";
type FieldKey = "name" | "email" | "subject" | "message";

const categories = ["", "AI / ML", "Backend", "Data", "Collaboration", "Other"];

function fieldProblems(fields: { name: string; email: string; subject: string; message: string; category: string }) {
  const problems: Partial<Record<FieldKey, string>> = {};
  if (fields.name.trim().length < 2 || fields.name.trim().length > 80) problems.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) || fields.email.trim().length > 120) problems.email = "Add a valid email.";
  if (fields.subject.trim().length < 3 || fields.subject.trim().length > 140) problems.subject = "Add a subject.";
  if (fields.message.trim().length < 10 || fields.message.trim().length > 5000) problems.message = "Write a message of at least a few words.";
  return problems;
}

export function ContactForm() {
  const sending = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [problems, setProblems] = useState<Partial<Record<FieldKey, string>>>({});
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "", category: "", company: "" });

  const update = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFields((current) => ({ ...current, [key]: value }));
    if (key === "name" || key === "email" || key === "subject" || key === "message") {
      setProblems((current) => ({ ...current, [key]: undefined }));
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending.current) return;
    const nextProblems = fieldProblems(fields);
    setProblems(nextProblems);
    const problem = nextProblems.name || nextProblems.email || nextProblems.subject || nextProblems.message || "";
    if (problem || !categories.includes(fields.category)) {
      setStatus("error");
      setError(problem || "Choose a known category.");
      return;
    }
    sending.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (response.ok && data.ok) {
        setStatus("sent");
        setProblems({});
        setFields({ name: "", email: "", subject: "", message: "", category: "", company: "" });
        return;
      }
      if (data.error && /activation/i.test(data.error)) {
        setStatus("error");
        setError(data.error);
        return;
      }
      const direct = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          _replyto: fields.email,
          _subject: `Portfolio: ${fields.subject}`,
          message: fields.category ? `Category: ${fields.category}\n\n${fields.message}` : fields.message,
          _template: "table",
          _captcha: "false",
        }),
      });
      const directJson = (await direct.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
      const accepted = directJson?.success === true || directJson?.success === "true";
      if (direct.ok && accepted) {
        setStatus("sent");
        setProblems({});
        setFields({ name: "", email: "", subject: "", message: "", category: "", company: "" });
        return;
      }
      setStatus("error");
      const detail = directJson?.message || data.error || "The message was not sent.";
      setError(
        /activation/i.test(detail)
          ? `FormSubmit sent a one-time activation email to ${profile.email}. Open that link, then send this message again.`
          : detail,
      );
    } catch {
      setStatus("error");
      setError("The message was not sent. Email works directly.");
    } finally {
      sending.current = false;
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(fields.subject || "Hello")}&body=${encodeURIComponent(fields.message)}`;

  return (
    <form onSubmit={submit} className="mt-8 w-full max-w-xl" noValidate aria-busy={status === "sending"}>
      <label className="mt-4 block">
        <span className="kicker">Name</span>
        <input className="field" name="name" value={fields.name} onChange={update("name")} autoComplete="name" maxLength={80} required aria-invalid={problems.name ? true : undefined} aria-describedby={problems.name ? "name-error" : undefined} />
        {problems.name ? <span id="name-error" className="mt-1 block text-sm text-[var(--danger)]">{problems.name}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="kicker">Email</span>
        <input className="field" type="email" name="email" inputMode="email" value={fields.email} onChange={update("email")} autoComplete="email" maxLength={120} required aria-invalid={problems.email ? true : undefined} aria-describedby={problems.email ? "email-error" : undefined} />
        {problems.email ? <span id="email-error" className="mt-1 block text-sm text-[var(--danger)]">{problems.email}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="kicker">Subject</span>
        <input className="field" name="subject" value={fields.subject} onChange={update("subject")} maxLength={140} required aria-invalid={problems.subject ? true : undefined} aria-describedby={problems.subject ? "subject-error" : undefined} />
        {problems.subject ? <span id="subject-error" className="mt-1 block text-sm text-[var(--danger)]">{problems.subject}</span> : null}
      </label>
      <label className="mt-4 block">
        <span className="kicker">Project category</span>
        <select className="field" name="category" value={fields.category} onChange={update("category")}>
          <option value="">Optional</option>
          {categories.filter(Boolean).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block">
        <span className="kicker">Message</span>
        <textarea className="field" name="message" value={fields.message} onChange={update("message")} maxLength={5000} required aria-invalid={problems.message ? true : undefined} aria-describedby={problems.message ? "message-error" : undefined} />
        {problems.message ? <span id="message-error" className="mt-1 block text-sm text-[var(--danger)]">{problems.message}</span> : null}
        <span className="mt-1 block font-mono text-[11px] text-[var(--faint)]">{fields.message.length} / 5000</span>
      </label>
      <label className="hp" aria-hidden="true">
        Company
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={fields.company} onChange={update("company")} />
      </label>
      <div className="contact-actions mt-6">
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send message"}
        </button>
        <a className="btn-ghost" href={mailto}>
          Open in email
        </a>
      </div>
      <p className="mt-4 min-h-6 text-sm" role="status">
        {status === "sent" ? "Message delivered." : null}
        {status === "error" ? error : null}
      </p>
      <button type="button" className="btn-text" onClick={copy}>
        <span>{copied ? "Email copied" : "Copy email"}</span>
      </button>
    </form>
  );
}
