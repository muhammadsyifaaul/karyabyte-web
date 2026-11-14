import clsx from "clsx";

interface KaryaByteLogoProps {
  size?: number;
  iconOnly?: boolean;
  className?: string;
}

export default function KaryaByteLogo({
  size = 140,
  iconOnly = false,
  className,
}: KaryaByteLogoProps) {
  const iconSize    = iconOnly ? size : Math.round(size * 0.29);
  const totalWidth  = iconOnly ? size : size;
  const totalHeight = iconOnly ? size : Math.round(size * 0.29);

  if (iconOnly) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
        xmlns="http://www.w3.org/2000/svg" aria-label="KaryaByte logo mark" role="img"
        className={className}>
        <KMarkParts />
      </svg>
    );
  }

  return (
    <svg width={totalWidth} height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`} fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="KaryaByte" role="img"
      className={clsx("select-none", className)}>
      <g transform={`scale(${iconSize / 48})`}>
        <KMarkParts />
      </g>
      <text x={iconSize + 8} y={totalHeight * 0.72}
        fontFamily='"Space Grotesk", sans-serif' fontWeight="600"
        fontSize={Math.round(totalHeight * 0.42)} letterSpacing="-0.03em" fill="#FFFFFF">
        KARYABYTE
      </text>
    </svg>
  );
}

function KMarkParts() {
  return (
    <>
      <rect x="6" y="6" width="10" height="36" rx="3" ry="3" fill="white" />
      <path d="M 18 22 C 22 14, 36 8, 42 8 C 42 8, 42 10, 38 14 C 32 20, 22 24, 18 26 Z" fill="white" />
      <path d="M 18 26 C 22 28, 32 34, 38 40 C 42 44, 42 44, 42 44 C 36 44, 22 38, 18 30 Z" fill="white" />
    </>
  );
}

/**
 * KaryaByteLogoCompact — header lockup
 *
 * Fix: viewBox widened to "0 0 116 24" (was 80×24) so the full 9-character
 * "KARYABYTE" wordmark never clips the final "E".
 * The icon mark is 24×24 (scale 0.5 of 48×48), wordmark starts at x=28.
 * At font-size 11px with letter-spacing -0.03em, "KARYABYTE" is ~84px wide,
 * so total needed = 28 + 84 + 4 margin = 116px.
 */
export function KaryaByteLogoCompact({ className }: { className?: string }) {
  return (
    <svg width="116" height="24" viewBox="0 0 116 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="KaryaByte" role="img"
      className={clsx("select-none", className)}>
      <g transform="scale(0.5)">
        <KMarkParts />
      </g>
      <text x="28" y="17"
        fontFamily='"Space Grotesk", sans-serif'
        fontWeight="600" fontSize="11" letterSpacing="-0.03em" fill="#FFFFFF">
        KARYABYTE
      </text>
    </svg>
  );
}
