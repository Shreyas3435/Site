import { site } from "@/content/site";

/**
 * Project enquiry submission, tried in this order:
 *  1. `VITE_WEB3FORMS_KEY` → sent through Web3Forms, which emails it to the
 *     inbox the key was created for. No backend needed.
 *  2. `VITE_ENQUIRY_ENDPOINT` → POSTed as JSON to any other endpoint
 *     (Formspree, a CRM webhook, your own API route).
 *  3. Neither → opens the visitor's email app with the enquiry pre-written.
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

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;

/** `botcheck` is the honeypot field: real people never see it, so anything in it is a bot. */
export async function submitEnquiry(payload: Enquiry, botcheck = ""): Promise<EnquiryResult> {
  if (WEB3FORMS_KEY) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New project enquiry — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
        from_name: `${site.name} website`,
        botcheck,
        name: payload.name,
        email: payload.email,
        company: payload.company || "—",
        budget: payload.budget || "—",
        timeline: payload.timeline || "—",
        message: payload.brief,
      }),
    });
    const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !json?.success) throw new Error(`Web3Forms responded ${res.status}`);
    return { ok: true, via: "endpoint" };
  }

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
