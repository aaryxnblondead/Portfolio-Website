import { useMemo } from "react";

/**
 * The index tape as ambient background: the same seeded 240-session walk,
 * struck as three misregistered passes on a tilted plane with one accent
 * pulse travelling the line on its own clock. Pure decoration — no scroll
 * input, no readouts, no links. All values invented, never market data.
 */

const DAYS = 240;
const START = 22000;
/** Simulated stress episodes, [startDay, endDay] inclusive. */
const STRESS: Array<[number, number]> = [
  [88, 120],
  [168, 186],
];
const W = 960;
const H = 420;
const PAD = 24;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type TapePoint = { x: number; y: number };

function buildTape(): TapePoint[] {
  const rand = mulberry32(20260214);
  const vals: number[] = [START];
  let v = START;
  for (let i = 1; i < DAYS; i++) {
    const stress = STRESS.some(([a, b]) => i >= a && i <= b);
    const vol = stress ? 0.021 : 0.006;
    const drift = stress ? -0.0042 : 0.0009;
    const shock = (rand() + rand() + rand() - 1.5) / 1.5;
    v = v * (1 + drift + vol * shock);
    vals.push(v);
  }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return vals.map((val, i) => ({
    x: (i / (DAYS - 1)) * W,
    y: PAD + (1 - (val - min) / (max - min)) * (H - PAD * 2),
  }));
}

function pathOf(pts: TapePoint[]): string {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

export function MarketBackdrop() {
  const d = useMemo(() => pathOf(buildTape()), []);

  return (
    <div className="market-bg" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} className="market-grid" />
        ))}
        <path d={d} className="market-pass market-pass-rule" transform="translate(-7 -5)" />
        <path d={d} className="market-pass market-pass-ink" />
        <path d={d} className="market-pass market-pass-accent" transform="translate(7 6)" />
        <path d={d} className="market-pass market-pass-pulse" transform="translate(7 6)" />
      </svg>
    </div>
  );
}
