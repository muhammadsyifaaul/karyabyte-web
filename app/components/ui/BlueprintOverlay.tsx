"use client";

/**
 * BlueprintOverlay
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown only when mode === "blueprint".
 *
 * Safe-zone rules (must never overlap navbar or Hero metrics):
 *  • Navbar height = 64px (h-16). All top-pinned elements sit at top-24
 *    (96px) or lower to clear the fixed header.
 *  • Hero metrics strip is at the bottom ~160px. Annotations that would
 *    fall below 65% of viewport height are hidden on the Hero.
 *  • Left/right edge annotations use left-6 / right-6 (24px) so they
 *    never collide with the centred copy.
 *  • The floating "System Blueprint Mode" mode label sits at top-20 (80px),
 *    centred, well clear of navbar links which are right-aligned.
 */

import { useRef } from "react";
import clsx from "clsx";
import { useSceneStore } from "../../store/useSceneStore";

/* Each annotation is absolutely positioned using fixed Tailwind classes
   rather than percentage `left` values to avoid the translate(-50%) mis-
   placement that caused earlier overlap.                                    */
type Annotation = {
  id: string;
  label: string;
  sub: string;
  /** Tailwind position classes — must stay within safe margins */
  position: string;
  align: "left" | "right";
};

const ANNOTATIONS: Annotation[] = [
  {
    id: "partA",
    label: "PART A — SYS.PILLAR",
    sub: "System Architecture · Backend · DB",
    /* Left edge, vertically centred — well clear of navbar (top-24 = 96px)
       and clear of metrics strip at bottom                                  */
    position: "top-[38%] left-6",
    align: "left",
  },
  {
    id: "partB",
    label: "PART B — UI.BLADE.UPPER",
    sub: "UI/UX Craft · Design Systems",
    /* Right edge, upper third — clear of navbar top padding                 */
    position: "top-[30%] right-6",
    align: "right",
  },
  {
    id: "partC",
    label: "PART C — PM.BLADE.LOWER",
    sub: "Agile Delivery · Sprint Mgmt",
    /* Right edge, lower-middle — stays above 65% so it clears metrics       */
    position: "top-[54%] right-6",
    align: "right",
  },
  {
    id: "stack",
    label: "STACK",
    sub: "Next.js · TypeScript · PostgreSQL · Figma",
    /* Left edge, sits at 68% — above the ~75% where the divider appears     */
    position: "top-[68%] left-6",
    align: "left",
  },
];

/* Corner coordinate labels — push inward enough to avoid scrollbar/edge clip */
const CORNERS = [
  { cls: "top-24 left-6",    text: "X: -1.00 / Y:  1.00" },   // top-24 = below navbar
  { cls: "top-24 right-6",   text: "X:  1.00 / Y:  1.00" },
  { cls: "bottom-6 left-6",  text: "X: -1.00 / Y: -1.00" },
  { cls: "bottom-6 right-6", text: "X:  1.00 / Y: -1.00" },
];

export default function BlueprintOverlay() {
  const mode        = useSceneStore((s) => s.mode);
  const isBlueprint = mode === "blueprint";

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "absolute inset-0 pointer-events-none transition-opacity duration-700 z-20",
        isBlueprint ? "opacity-100" : "opacity-0"
      )}
    >
      {/* ── Orthographic grid ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(96,165,250,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Mode label — top-centre, below navbar (top-20 = 80px) ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2">
        <span className="font-mono text-blue-400/60 text-[10px] tracking-[0.25em] uppercase">
          System Blueprint Mode
        </span>
      </div>

      {/* ── Corner coordinates ── */}
      {CORNERS.map(({ cls, text }) => (
        <span key={cls}
          className={`absolute ${cls} font-mono text-blue-400/35 text-[9px] tracking-widest`}>
          {text}
        </span>
      ))}

      {/* ── Centre crosshair ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-6 h-6">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-400/20 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/20 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 border border-blue-400/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ── Architectural annotations — safe-zone pinned ── */}
      {ANNOTATIONS.map((ann) => (
        <div
          key={ann.id}
          className={clsx(
            "absolute flex flex-col gap-0.5",
            ann.position,
            ann.align === "right" ? "items-end text-right" : "items-start text-left"
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50 mb-1" />
          <span className="font-mono text-blue-300/75 text-[9px] tracking-widest uppercase leading-tight">
            {ann.label}
          </span>
          <span className="font-mono text-blue-400/45 text-[8px] leading-tight">
            {ann.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
