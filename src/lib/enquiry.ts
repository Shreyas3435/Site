import { site } from "@/content/site";

/**
 * Project enquiry submission.
 * Set `VITE_ENQUIRY_ENDPOINT` (Formspree, Web3Forms, a CRM webhook or your own
 * API route) and enquiries are POSTed there as JSON. Without it, the form falls
 * back to opening the visitor's email app with the enquiry pre-written.
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

export type EnquiryResult = { ok: true; via: "endpoint" | "email" };

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;

export async function submitEnquiry(payload: Enquiry): Promise<EnquiryResult> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, _subject: `New project enquiry — ${payload.name}` }),
    });
    if (!res.ok) throw new Error(`Enquiry endpoint responded ${res.status}`);
    return { ok: true, via: "endpoint" };
  }

  const body = [
    payload.brief,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company && `Company: ${payload.company}`,
    payload.budget && `Budget: ${payload.budget}`,
    payload.timeline && `Timeline: ${payload.timeline}`,
  ]
    .filter((l) => l !== undefined && l !== "")
    .join("\n");
  const subject = `Project enquiry — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { ok: true, via: "email" };
}
