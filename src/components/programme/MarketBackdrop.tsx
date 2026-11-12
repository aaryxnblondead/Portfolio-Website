import { useMemo } from "react";
import { TAPE_HEIGHT, TAPE_WIDTH, tapePath } from "@/lib/market-tape";

/**
 * The index tape as ambient background: the same seeded 240-session walk,
 * struck as three misregistered passes on a tilted plane with one accent
 * pulse travelling the line on its own clock. Pure decoration — no scroll
 * input, no readouts, no links. All values invented, never market data.
 */
export function MarketBackdrop() {
  const d = useMemo(() => tapePath(), []);

  return (
    <div className="market-bg" aria-hidden="true">
      <svg viewBox={`0 0 ${TAPE_WIDTH} ${TAPE_HEIGHT}`} preserveAspectRatio="xMaxYMax slice">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={TAPE_WIDTH}
            y1={TAPE_HEIGHT * f}
            y2={TAPE_HEIGHT * f}
            className="market-grid"
          />
        ))}
        <path d={d} className="market-pass market-pass-rule" transform="translate(-7 -5)" />
        <path d={d} className="market-pass market-pass-ink" />
        <path d={d} className="market-pass market-pass-accent" transform="translate(7 6)" />
        <path d={d} className="market-pass market-pass-pulse" transform="translate(7 6)" />
      </svg>
    </div>
  );
}
