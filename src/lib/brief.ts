import { useSyncExternalStore } from "react";

/**
 * A tiny shared store so the project planner can hand a drafted brief to the
 * enquiry form, which may be on the same page or on /contact.
 */
export type BriefDraft = { brief: string; timeline?: string; stamp: number };

let draft: BriefDraft | null = null;
const listeners = new Set<() => void>();

export function setBriefDraft(next: Omit<BriefDraft, "stamp">) {
  draft = { ...next, stamp: Date.now() };
  listeners.forEach((l) => l());
}

export function useBriefDraft() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => draft,
    () => null,
  );
}
