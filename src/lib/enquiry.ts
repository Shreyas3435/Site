import { site } from "@/content/site";

/**
 * Project enquiry submission.
 * Enquiries are sent through FormSubmit (formsubmit.co), which emails each one
 * to `site.email`. No backend or API key: the first submission triggers a
 * one-time "Activate form" email to that inbox, and everything after that is
 * delivered straight through. Replies go to the visitor, because FormSubmit
 * uses their `email` field as the reply-to address.
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

const ENDPOINT = `https://formsubmit.co/ajax/${site.email}`;

/** `honeypot` is a field real people never see, so anything in it means a bot. */
export async function submitEnquiry(payload: Enquiry, honeypot = ""): Promise<EnquiryResult> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New project enquiry — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
      _template: "table",
      _honey: honeypot,
      Name: payload.name,
      email: payload.email,
      Company: payload.company || "—",
      Budget: payload.budget || "—",
      Timeline: payload.timeline || "—",
      Brief: payload.brief,
    }),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
  if (!res.ok || String(json?.success) !== "true") throw new Error(`FormSubmit responded ${res.status}`);
  return { ok: true };
}
