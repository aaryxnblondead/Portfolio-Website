/**
 * The analogue layer lives in the material, not in added elements.
 * Neither component occupies any grid space. FilmGrain renders once,
 * at the app root — never per page.
 */

export function FilmGrain({ animated = true }: { animated?: boolean }) {
  return (
    <div aria-hidden="true" className={`grainLayer ${animated ? "grainRun" : ""}`}>
      <svg width="100%" height="100%">
        <filter id="programme-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#programme-grain)" />
      </svg>
    </div>
  );
}

export function Perforations({
  axis = "x",
  className = "",
}: {
  axis?: "x" | "y";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${axis === "y" ? "perfY" : "perfX"}${className ? ` ${className}` : ""}`}
    />
  );
}
