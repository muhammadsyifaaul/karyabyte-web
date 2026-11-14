/**
 * KaryaByte — Global Scene Store (Zustand)
 *
 * Single source of truth for:
 *  - mode:            "design" | "blueprint"  — X-Ray toggle
 *  - scrollSection:   which named section the viewport is currently in
 *
 * The actual numeric scroll targets for the 3D parts live in
 * monolithScrollTargets (a plain mutable ref exported from KaryaByteMonolith)
 * so GSAP can write to them without touching React state.
 */
import { create } from "zustand";

export type SceneMode = "design" | "blueprint";
export type ScrollSection =
  | "hero"
  | "duo"
  | "pipeline"
  | "works"
  | "contact"
  | "other";

interface SceneStore {
  mode: SceneMode;
  toggleMode: () => void;
  setMode: (m: SceneMode) => void;
  scrollSection: ScrollSection;
  setScrollSection: (s: ScrollSection) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  mode: "design",
  toggleMode: () =>
    set((s) => ({ mode: s.mode === "design" ? "blueprint" : "design" })),
  setMode: (mode) => set({ mode }),
  scrollSection: "hero",
  setScrollSection: (scrollSection) => set({ scrollSection }),
}));
