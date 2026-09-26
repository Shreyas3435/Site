/** Options for the interactive project planner on the home page. */

export type CrewCode = "SRV" | "UI" | "AI" | "OPS";

export type Need = { id: string; label: string; group: "Build" | "Improve"; crew: CrewCode[] };

export const needs: Need[] = [
  { id: "website", label: "Website", group: "Build", crew: ["UI"] },
  { id: "webapp", label: "Web app", group: "Build", crew: ["UI", "SRV"] },
  { id: "mvp", label: "MVP", group: "Build", crew: ["UI", "SRV", "OPS"] },
  { id: "internal", label: "Internal tool", group: "Build", crew: ["UI", "SRV"] },
  { id: "ai", label: "AI features", group: "Improve", crew: ["AI", "SRV"] },
  { id: "search", label: "Better search", group: "Improve", crew: ["SRV", "AI"] },
  { id: "perf", label: "Performance", group: "Improve", crew: ["UI", "SRV"] },
  { id: "automation", label: "Automation", group: "Improve", crew: ["SRV", "AI"] },
  { id: "cloud", label: "Cloud & DevOps", group: "Improve", crew: ["OPS"] },
  { id: "legacy", label: "Modernization", group: "Improve", crew: ["SRV", "OPS"] },
];

export const stages = [
  { id: "idea", label: "Just an idea", start: "Understand → Design", note: "We start by framing the problem and cutting scope to what matters." },
  { id: "product", label: "Have a product", start: "Diagnose → Build", note: "We start with a focused audit so the first fix is the one that matters most." },
  { id: "scaling", label: "Scaling up", start: "Measure → Improve", note: "We start from your metrics and work on whatever limits growth first." },
] as const;

/** Mirrors the timeline chips on the enquiry form so a brief pre-fills cleanly. */
export const timelines = ["ASAP", "1–3 months", "3–6 months", "Flexible"];
