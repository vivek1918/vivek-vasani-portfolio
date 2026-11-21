import { NextResponse } from "next/server";
import { profile } from "@/data/profile";

const buckets = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 5;
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return fail("Too many messages. Try again in a minute.", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("The message could not be read.", 400);
  }

  const data = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? "").trim();
  const category = String(data.category ?? "").trim();
  const company = String(data.company ?? "").trim();
  const allowed = ["", "AI / ML", "Backend", "Data", "Collaboration", "Other"];

  if (company) return NextResponse.json({ ok: true });
  if (name.length < 2 || name.length > 80) return fail("Add your name.", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return fail("Add a valid email.", 400);
  if (subject.length < 3 || subject.length > 140) return fail("Add a subject.", 400);
  if (message.length < 10 || message.length > 5000) return fail("Write a message of at least a few words.", 400);
  if (!allowed.includes(category)) return fail("Choose a known category.", 400);

  const bodyText = category ? `Category: ${category}\n\n${message}` : message;

  const web3 = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3,
        name,
        email,
        subject: `Portfolio: ${subject}`,
        message: bodyText,
        from_name: "Vivek Vasani Portfolio",
      }),
    });
    const json = (await response.json().catch(() => null)) as { success?: boolean } | null;
    if (!response.ok || !json?.success) return fail("The message was not delivered. Email works directly.", 502);
    return NextResponse.json({ ok: true });
  }

  const resend = process.env.RESEND_API_KEY;
  if (resend) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || profile.email],
        reply_to: email,
        subject: `Portfolio: ${subject}`,
        text: `${name} <${email}>\n\n${bodyText}`,
      }),
    });
    if (!response.ok) return fail("The message was not delivered. Email works directly.", 502);
    return NextResponse.json({ ok: true });
  }

  try {
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(origin ? { Origin: origin, Referer: `${origin}/contact` } : {}),
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: `Portfolio: ${subject}`,
        message: bodyText,
        _template: "table",
        _captcha: "false",
      }),
    });
    const json = (await response.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
    const accepted = json?.success === true || json?.success === "true";
    if (!response.ok || !accepted) {
      const detail = json?.message || "";
      if (/activation/i.test(detail)) {
        return fail(`FormSubmit sent a one-time activation email to ${profile.email}. Open that link, then send this message again.`, 502);
      }
      return fail(detail || "The message was not delivered. Email works directly.", 502);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return fail("The message was not delivered. Email works directly.", 502);
  }
}
