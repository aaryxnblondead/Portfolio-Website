/**
 * The seeded 240-session index walk behind the About backdrop.
 *
 * All values are invented — this is decoration that happens to be
 * deterministic, never market data and never a live feed. Kept out of the
 * component so the geometry can be reasoned about (and re-seeded) alone.
 */

const DAYS = 240;
const START = 22000;
const PAD = 24;
/** Simulated stress episodes, [startDay, endDay] inclusive. */
const STRESS: Array<[number, number]> = [
  [88, 120],
  [168, 186],
];

export const TAPE_WIDTH = 960;
export const TAPE_HEIGHT = 420;

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

/**
 * The SVG path for the whole walk, in the TAPE_WIDTH x TAPE_HEIGHT viewBox.
 * Prices are generated first so the series can be normalised to the frame.
 */
export function tapePath(): string {
  const rand = mulberry32(20260214);
  const values = [START];
  let v = START;

  for (let i = 1; i < DAYS; i++) {
    const stress = STRESS.some(([a, b]) => i >= a && i <= b);
    const vol = stress ? 0.021 : 0.006;
    const drift = stress ? -0.0042 : 0.0009;
    const shock = (rand() + rand() + rand() - 1.5) / 1.5;
    v = v * (1 + drift + vol * shock);
    values.push(v);
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const segments: string[] = [];

  values.forEach((value, i) => {
    const x = (i / (DAYS - 1)) * TAPE_WIDTH;
    const y = PAD + (1 - (value - min) / (max - min)) * (TAPE_HEIGHT - PAD * 2);
    segments.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  });

  return segments.join(" ");
}
