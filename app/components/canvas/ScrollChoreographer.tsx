"use client";

/**
 * ScrollChoreographer
 * ─────────────────────────────────────────────────────────────────────────────
 * A zero-render component that activates the scroll choreography hook.
 * Rendered as a sibling of KaryaByteCanvas inside the Hero section so it
 * mounts after the DOM sections exist.
 *
 * Lives OUTSIDE the R3F <Canvas> — it bridges the DOM scroll world to the
 * monolithScrollTargets plain object that KaryaByteMonolith's useFrame reads.
 */

import { useScrollChoreography } from "../../hooks/useScrollChoreography";

export default function ScrollChoreographer() {
  useScrollChoreography();
  return null; // renders nothing — side-effect only
}
