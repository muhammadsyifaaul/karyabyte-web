"use client";

/**
 * CanvasLayer — client-only dynamic import wrapper for KaryaByteCanvas.
 * Rendered from page.tsx (Server Component) without triggering the
 * "ssr:false not allowed in Server Components" error.
 */
import dynamic from "next/dynamic";

const KaryaByteCanvas = dynamic(
  () => import("./KaryaByteCanvas"),
  { ssr: false, loading: () => null }
);

export default function CanvasLayer() {
  return <KaryaByteCanvas fixed />;
}
