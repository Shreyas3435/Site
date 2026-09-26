import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { timelines as TIMELINES } from "@/content/planner";
import { liveSocials, site } from "@/content/site";
import { useBriefDraft } from "@/lib/brief";
import { submitEnquiry, validateEnquiry, type Enquiry, type EnquiryErrors, type EnquiryResult } from "@/lib/enquiry";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/easing";
import { Button } from "@/components/ui/Button";
import { SlidingArrow } from "@/components/ui/Arrow";
import { RevealText, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Corners } from "@/components/ui/Placeholder";

const BUDGETS = ["< $10k", "$10–25k", "$25–75k", "$75k+", "Not sure yet"];
export function ContactSection({ asPage = false }: { asPage?: boolean }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={cn("relative border-t border-line", asPage ? "pb-28 pt-[calc(var(--header-h)+5rem)] md:pb-40" : "py-28 md:py-40")}
    >
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index={asPage ? undefined : "11"}>Contact</SectionLabel>
          <RevealText
            as={asPage ? "h1" : "h2"}
            id="contact-title"
            immediate={asPage}
            delay={asPage ? 0.9 : 0}
            lines={["Start a", "project."]}
            className="mt-8 text-mega font-medium uppercase"
          />
          <Reveal className="mt-10 max-w-md space-y-10">
            <p className="text-lede text-fg-2">
              A few sentences is plenty. What are you building, what's in the way, and when does it need to exist?
            </p>

            <div>
              <p className="eyebrow text-dim">Email</p>
              <CopyEmail />
            </div>

            {liveSocials.length > 0 && (
              <div>
                <p className="eyebrow text-dim">Elsewhere</p>
                <ul className="mt-3 border-t border-line">
                  {liveSocials.map((s) => (
                    <li key={s.label} className="border-b border-line">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between py-3.5 transition-colors hover:text-accent"
                      >
                        <span className="font-medium">{s.label}</span>
                        <span className="flex items-center gap-3 eyebrow text-muted group-hover:text-accent">
                          {s.handle} <SlidingArrow dir="up-right" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="grid grid-cols-3 gap-px border border-line bg-line">
              {[
                ["4", "Senior engineers"],
                ["1 call", "To scope it"],
                ["0", "Hand-offs"],
              ].map(([v, l]) => (
                <li key={l} className="bg-ink px-4 py-5">
                  <p className="text-xl font-medium tracking-tight">{v}</p>
                  <p className="mt-1 eyebrow text-[0.5625rem] text-muted">{l}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4">
      <a
        href={`mailto:${site.email}`}
        className="link-line text-[clamp(1.25rem,2.2vw,1.875rem)] font-medium tracking-tight hover:text-accent transition-colors"
      >
        {site.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-line-2 px-3 py-1 eyebrow text-[0.625rem] text-muted transition-colors hover:border-fg/40 hover:text-fg"
        aria-live="polite"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

function EnquiryForm() {
  const [values, setValues] = useState<Enquiry>({ name: "", email: "", company: "", brief: "", budget: "", timeline: "" });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [via, setVia] = useState<EnquiryResult["via"]>("endpoint");
  const draft = useBriefDraft();

  // A brief drafted in the planner flows straight into the form.
  useEffect(() => {
    if (!draft) return;
    setValues((prev) => ({ ...prev, brief: draft.brief, timeline: draft.timeline ?? prev.timeline }));
    setStatus("idle");
  }, [draft]);

  const set = (k: keyof Enquiry) => (v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await submitEnquiry(values);
      setVia(res.via);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative border border-line bg-ink-2/60 p-6 md:p-10">
      <Corners />
      <div className="mb-8 flex items-center justify-between eyebrow text-muted">
        <span>
          <span className="text-accent">■</span>&nbsp; Project enquiry
        </span>
        <span>{status === "sent" ? "Received" : "Form / 01"}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="flex min-h-[28rem] flex-col justify-center"
            role="status"
          >
            <svg viewBox="0 0 48 48" className="size-12 text-accent" fill="none" aria-hidden="true">
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                stroke="currentColor"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              />
              <motion.path
                d="M15 24.5l6 6 12-13"
                stroke="currentColor"
                strokeWidth="1.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: EASE_OUT }}
              />
            </svg>
            <p className="mt-8 text-heading font-medium">Thanks, {values.name.split(" ")[0] || "there"}.</p>
            <p className="mt-3 max-w-sm text-fg-2">
              {via === "email"
                ? "Your email app should now be open with the enquiry written out — just hit send. We read every enquiry ourselves."
                : `Your message is in. We read every enquiry ourselves and will reply to ${values.email}.`}
            </p>
            <button
              type="button"
              onClick={() => {
                setValues({ name: "", email: "", company: "", brief: "", budget: "", timeline: "" });
                setStatus("idle");
              }}
              className="mt-10 self-start eyebrow text-muted link-line hover:text-fg"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
            aria-describedby="form-note"
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <Field name="name" label="Name" value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" required />
              <Field
                name="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
                required
              />
            </div>
            <Field name="company" label="Company" hint="Optional" value={values.company ?? ""} onChange={set("company")} autoComplete="organization" />
            <Field
              name="brief"
              label="What are you trying to build?"
              value={values.brief}
              onChange={set("brief")}
              error={errors.brief}
              multiline
              required
            />
            <ChipGroup label="Budget" hint="Optional" options={BUDGETS} value={values.budget ?? ""} onChange={set("budget")} />
            <ChipGroup label="Timeline" hint="Optional" options={TIMELINES} value={values.timeline ?? ""} onChange={set("timeline")} />

            <div className="flex flex-col-reverse gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p id="form-note" className="max-w-xs text-xs leading-relaxed text-muted">
                {status === "error"
                  ? "Something went wrong sending that. Please try again, or email us directly."
                  : "No newsletters, no sales sequences. Just a reply from an engineer."}
              </p>
              <Button type="submit" variant="accent" size="lg" disabled={status === "sending"} cursorLabel="Send">
                {status === "sending" ? "Sending…" : "Send project"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  name,
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
  required = false,
  autoComplete,
}: {
  name: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  const errId = `${id}-error`;
  const common = {
    id,
    name,
    value,
    required,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? errId : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    placeholder: " ",
    className: cn(
      "peer block w-full resize-none border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-fg outline-none transition-colors duration-300",
      "placeholder-shown:border-line-2 focus:border-accent",
      error ? "border-accent" : "border-fg/40",
    ),
  };

  return (
    <div className="relative">
      {multiline ? <textarea rows={4} {...common} /> : <input type={type} autoComplete={autoComplete} {...common} />}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-0 origin-left eyebrow transition-all duration-300 ease-[var(--ease-out-expo)]",
          "text-muted peer-focus:text-accent",
          "peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-sans",
          "peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:font-mono",
        )}
      >
        {label}
        {required && <span className="text-accent"> *</span>}
        {hint && <span className="text-dim"> — {hint}</span>}
      </label>
      {/* focus line that grows from the left */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] peer-focus:scale-x-100"
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={errId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 eyebrow text-[0.625rem] text-accent"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChipGroup({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: ReactNode;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="eyebrow text-muted">
        {label} {hint && <span className="text-dim">— {hint}</span>}
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o;
          return (
            <label
              key={o}
              className={cn(
                "relative cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                checked ? "border-accent bg-accent/10 text-fg" : "border-line-2 text-fg-2 hover:border-fg/40 hover:text-fg",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o}
                checked={checked}
                onChange={() => onChange(o)}
                onClick={() => checked && onChange("")}
                className="sr-only"
              />
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
