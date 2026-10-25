import { site } from "@/content/site";

/**
 * Project enquiry submission.
 * The form posts to /api/enquiry, served by the Cloudflare Worker in
 * worker/index.ts, which emails the enquiry to the studio inbox through
 * Cloudflare Email Routing. Replies go to the visitor via Reply-To.
 * If sending fails, the form offers `mailtoFor()` so nothing is lost.
 */

export type Enquiry = {
  name: string;
  email: string;
  company?: string;
  brief: string;
  budget?: string;
  timeline?: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!e.name.trim()) errors.name = "Tell us who you are.";
  if (!e.email.trim()) errors.email = "We need an email to reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) errors.email = "That email doesn't look right.";
  if (e.brief.trim().length < 10) errors.brief = "A sentence or two is enough to start.";
  return errors;
}

export type EnquiryResult = { ok: true };

/** `honeypot` is a field real people never see, so anything in it means a bot. */
export async function submitEnquiry(payload: Enquiry, honeypot = ""): Promise<EnquiryResult> {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...payload, honeypot }),
  });
  const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || json?.ok !== true) throw new Error(`Enquiry endpoint responded ${res.status}`);
  return { ok: true };
}

/** A pre-filled email with the same enquiry, for when the form can't send. */
export function mailtoFor(e: Enquiry) {
  const details = [
    `Name: ${e.name}`,
    e.company ? `Company: ${e.company}` : null,
    e.budget ? `Budget: ${e.budget}` : null,
    e.timeline ? `Timeline: ${e.timeline}` : null,
  ].filter((l): l is string => l !== null);
  const lines = [...details, "", e.brief];
  const subject = `Project enquiry — ${e.name}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
