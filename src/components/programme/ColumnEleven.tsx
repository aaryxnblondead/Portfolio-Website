/**
 * The margin strip that slipped: a vertical timecode lane, sticky for the
 * whole run, governed by three positional rules rather than randomness.
 * MarqueeRule is the horizontal sibling for section breaks.
 */

const DEFAULT_TIMES = [
  "№ 01",
  "VORTEX-AI",
  "№ 02",
  "ANORA",
  "№ 03",
  "VIDHAAN AI",
  "№ 04",
  "QUALIFYAI",
  "BELT",
  "09 FRAMES",
  "COLOPHON",
  "END",
];

export function RunningTimeLane({
  entries = DEFAULT_TIMES,
  total = "TOTAL — 04 ENTRIES · 09 FRAMES",
}: {
  entries?: string[];
  total?: string;
}) {
  // Doubled so the -50% translate loops seamlessly.
  const loop = [...entries, ...entries];

  return (
    <div className="pLane">
      <div className="pLaneMask">
        <div className="pLaneScroll">
          {loop.map((t, i) => {
            const hot = i % 4 === 3;
            const flipped = i % 7 === 6;
            return (
              <span
                key={i}
                className={`pLaneItem${hot ? " is-hot" : ""}${flipped ? " is-flip" : ""}`}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      <span className="pLaneTotal">{total}</span>
    </div>
  );
}

export function MarqueeRule({
  text = "INTERMISSION",
  repeat = 14,
  separator = "·",
}: {
  text?: string;
  repeat?: number;
  separator?: string;
}) {
  const items = Array.from({ length: repeat }, (_, i) => i);

  return (
    <div className="pMarquee" aria-hidden="true">
      <div className="pMarqueeTrack">
        {[0, 1].map((half) => (
          <div key={half} className="pMarqueeHalf">
            {items.map((i) => (
              <span key={i} className={`pMarqueeItem${i % 5 === 4 ? " is-hot" : ""}`}>
                {text}
                <span className="pMarqueeSep">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
