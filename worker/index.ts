/**
 * Cloudflare Worker in front of the static site.
 * Static files are served straight from dist/ (wrangler.jsonc `assets`); only
 * /api/* reaches this code. POST /api/enquiry emails the enquiry to the studio
 * inbox through Cloudflare Email Routing (`send_email` binding), so there is no
 * third-party form service and nothing to re-activate when the domain changes.
 */
import { EmailMessage } from "cloudflare:email";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ENQUIRY_EMAIL: { send(message: EmailMessage): Promise<void> };
  /** The verified Email Routing destination the enquiry goes to. */
  ENQUIRY_TO: string;
  /** Any address on the routed domain; it only appears as the sender. */
  ENQUIRY_FROM: string;
}

type Enquiry = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  brief?: unknown;
  budget?: unknown;
  timeline?: unknown;
  honeypot?: unknown;
};

const LIMITS = { name: 120, email: 200, company: 160, brief: 5000, budget: 60, timeline: 60 };
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** Trimmed string, capped, with no line breaks (safe to use inside a header). */
const field = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "";

/** Base64 of UTF-8 text, wrapped at 76 columns as MIME requires. */
function b64(text: string) {
  let bin = "";
  for (const byte of new TextEncoder().encode(text)) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/.{76}/g, "$&\r\n");
}

/** RFC 2047 encoded-word, so names and dashes outside ASCII survive in headers. */
const encodeHeader = (text: string) => `=?UTF-8?B?${b64(text).replace(/\r\n/g, "")}?=`;

async function handleEnquiry(request: Request, env: Env) {
  let body: Enquiry;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Bots fill the hidden field; pretend it worked and drop it.
  if (field(body.honeypot, 200)) return json({ ok: true });

  const name = field(body.name, LIMITS.name);
  const email = field(body.email, LIMITS.email);
  const company = field(body.company, LIMITS.company);
  const budget = field(body.budget, LIMITS.budget);
  const timeline = field(body.timeline, LIMITS.timeline);
  const brief = typeof body.brief === "string" ? body.brief.trim().slice(0, LIMITS.brief) : "";
  if (!name || !EMAIL_RE.test(email) || brief.length < 10) {
    return json({ ok: false, error: "Please fill in your name, email and a short brief." }, 400);
  }

  const text = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Company:   ${company || "—"}`,
    `Budget:    ${budget || "—"}`,
    `Timeline:  ${timeline || "—"}`,
    "",
    "Brief:",
    brief,
    "",
    "—",
    "Sent from the enquiry form on arkatechlabs.com. Reply to this email to answer the client directly.",
  ].join("\n");

  const domain = env.ENQUIRY_FROM.split("@")[1];
  const raw = [
    `From: ${encodeHeader("Arka website")} <${env.ENQUIRY_FROM}>`,
    `To: <${env.ENQUIRY_TO}>`,
    `Reply-To: ${encodeHeader(name)} <${email}>`,
    `Subject: ${encodeHeader(`New project enquiry — ${name}${company ? ` (${company})` : ""}`)}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64(text),
  ].join("\r\n");

  try {
    await env.ENQUIRY_EMAIL.send(new EmailMessage(env.ENQUIRY_FROM, env.ENQUIRY_TO, raw));
  } catch (err) {
    console.error("Enquiry email failed", err);
    return json({ ok: false, error: "Could not send right now." }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/enquiry") {
      if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
      return handleEnquiry(request, env);
    }
    if (pathname.startsWith("/api/")) return json({ ok: false, error: "Not found." }, 404);
    return env.ASSETS.fetch(request);
  },
};
