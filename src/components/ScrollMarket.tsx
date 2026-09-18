"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * ScrollMarket — a simulated index tape docked to the left edge of the
 * About page on desktop. Page scroll advances the tape: the line draws
 * itself as the reader moves through the story and the readout follows
 * the head of the revealed segment.
 *
 * House rules, kept: hairline inline SVG in currentColor, no radius, no
 * shadow, no gradient, no looped animation. Scroll is the only driver,
 * throttled through rAF with a passive listener, and the whole dock stays
 * hidden below desktop widths. Under prefers-reduced-motion (or without
 * JS) it renders the complete tape as a static figure. Every number is
 * invented by a seeded walk and labelled simulated, never market data.
 */

const DAYS = 240;
const START = 22000;
const MIN_HEAD = 12;
/** Simulated stress episodes, [startDay, endDay] inclusive. */
const STRESS: Array<[number, number]> = [
  [88, 120],
  [168, 186],
];
const W = 232;
const H = 112;
const PAD = 10;

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

type TapePoint = { x: number; y: number; v: number };

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
    v: val,
  }));
}

function pathOf(pts: TapePoint[], n: number): string {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < n; i++) {
    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

function regimeAt(day: number): "STRESS" | "CALM" {
  return STRESS.some(([a, b]) => day >= a && day <= b) ? "STRESS" : "CALM";
}

const fmtInt = (n: number) => Math.round(n).toLocaleString("en-IN");

export function ScrollMarket() {
  const pts = useMemo(buildTape, []);
  // Full tape by default: correct pre-hydration, correct without JS,
  // and the required final state under prefers-reduced-motion.
  const [head, setHead] = useState(DAYS);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (reduce.matches) {
      setShown(true);
      return;
    }
    if (!desktop.matches) return;
    const story = document.querySelector(".neo-about-story");
    if (!story) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.innerWidth < 1024) return;
      const r = story.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (-vh * 0.22 - r.top) / (r.height - vh * 0.6)));
      setHead(MIN_HEAD + Math.round(progress * (DAYS - MIN_HEAD)));
      // Appears once the story is under way and the left rail has
      // scrolled clear, so the dock never covers the portrait.
      setShown(r.top < -vh * 0.22);
    };
    const request = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const last = pts[head - 1];
  const chg = ((last.v - START) / START) * 100;
  const regime = regimeAt(head - 1);
  const track = pathOf(pts, DAYS);
  const line = pathOf(pts, head);

  return (
    <aside className={`tape-dock${shown ? " is-shown" : ""}`} aria-label="Simulated market tape">
      <div className="tape-card">
        <div className="tape-head">
          <span className="tape-title">NIFTY-50 / SIM TAPE</span>
          <span className={`tape-regime${regime === "STRESS" ? " is-stress" : ""}`}>{regime}</span>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Simulated index illustration, day ${head} of ${DAYS}, level ${fmtInt(last.v)}, regime ${regime}. Invented data.`}
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} className="tape-grid" />
          ))}
          <path d={track} className="tape-track" />
          <path d={line} className="tape-line" />
          <circle cx={last.x} cy={last.y} r={2.5} className="tape-dot" />
        </svg>
        <p className="tape-read" aria-hidden="true">
          <span>LVL {fmtInt(last.v)}</span>
          <span>
            DAY {head}/{DAYS}
          </span>
          <span>
            {chg >= 0 ? "+" : ""}
            {chg.toFixed(1)}%
          </span>
        </p>
        <p className="sr-only">
          Illustration only: a simulated 240-session index tape with two stress episodes. It advances as the
          page scrolls. All values are invented, not market data.
        </p>
        <p className="tape-cap">
          Scroll draws the tape. Regime logic from <Link href="/work/capstone">Vortex-AI</Link>. Simulated,
          not market data.
        </p>
      </div>
    </aside>
  );
}
