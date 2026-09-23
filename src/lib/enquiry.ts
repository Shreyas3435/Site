/**
 * Project enquiry submission.
 * PLACEHOLDER — no backend yet. Swap the body of `submitEnquiry` for a real
 * call (API route, Formspree, CRM webhook…). The form UI already handles
 * pending / success / error states based on this promise.
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

export async function submitEnquiry(payload: Enquiry): Promise<{ ok: true }> {
  // Simulated latency so the pending state can be designed and tested.
  await new Promise((r) => setTimeout(r, 1400));
  if (import.meta.env.DEV) console.info("[enquiry] would submit", payload);
  return { ok: true };
}
