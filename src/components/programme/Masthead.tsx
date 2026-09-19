import { Sheet, Rail, Content } from "./Sheet";

/**
 * TLOP wall: one word run seven times through the press, each pass a
 * different plate. Every pass starts on column 3 and breaks right only;
 * a single pass drifts left into the rail. Screen readers get one h1;
 * the wall itself is decoration.
 */

type Pass = {
  width: "pWdth62" | "pWdth100" | "pWdth125" | "pWdth88";
  x: string;
  treat: "solid" | "outline" | "orange" | "ghost" | "knockout";
};

const PASSES_FULL: Pass[] = [
  { width: "pWdth62", x: "0em", treat: "solid" },
  { width: "pWdth100", x: "0.05em", treat: "outline" },
  { width: "pWdth125", x: "-0.02em", treat: "solid" },
  { width: "pWdth88", x: "0.03em", treat: "knockout" },
  { width: "pWdth125", x: "-0.04em", treat: "orange" },
  { width: "pWdth62", x: "-0.16em", treat: "outline" },
  { width: "pWdth100", x: "0.08em", treat: "ghost" },
];

/* Compact home wall: four plates only — solid / outline / knockout / ghost.
   Same registration drift, smaller measure, one viewport. */
const PASSES_COMPACT: Pass[] = [
  { width: "pWdth62", x: "0em", treat: "solid" },
  { width: "pWdth100", x: "0.05em", treat: "outline" },
  { width: "pWdth88", x: "0.03em", treat: "knockout" },
  { width: "pWdth100", x: "0.08em", treat: "ghost" },
];

const TREATMENT: Record<Pass["treat"], string> = {
  solid: "pWallSolid",
  outline: "pStrokeInk",
  orange: "pWallOrange",
  ghost: "pWallGhost",
  knockout: "pWallKnockout",
};

export function Masthead({
  word = "PROGRAMME",
  name = "Aaryan Singh",
  role = "Applied machine learning",
  meta = [
    ["EDITION", "No. 04"],
    ["PLACE", "Mumbai"],
    ["SET IN", "Neue Machina / Space Mono"],
    ["ENTRIES", "04"],
    ["AVAILABLE", "Nov 2026"],
  ] as [string, string][],
  compact = false,
}: {
  word?: string;
  name?: string;
  role?: string;
  meta?: [string, string][];
  /** Home gets the 4-pass compact wall; About and long pages get full 7-pass. */
  compact?: boolean;
}) {
  const passes = compact ? PASSES_COMPACT : PASSES_FULL;
  return (
    <Sheet as="header" className={`pMasthead${compact ? " pMasthead--compact" : ""}`}>
      <Rail className="pMono pMastRail">
        <div className="pRuleHeavy pMastRailRule">
          <div>№ 00</div>
          <div className="pMastRailSub">MASTHEAD</div>
        </div>
      </Rail>

      <Content className="pMastContent">
        <h1 className="sr-only">
          {name} — {role}
        </h1>

        <div aria-hidden="true" className={`pWall${compact ? " pWall--compact" : ""}`}>
          {passes.map((pass, i) => (
            <span
              key={i}
              style={{ transform: `translateX(${pass.x})` }}
              className={`pWallPass pRise ${i === 0 ? "gateWeave" : ""} ${pass.width} ${TREATMENT[pass.treat]}${i === 1 ? " pD1" : i === 2 ? " pD2" : i === 3 ? " pD3" : i === 4 ? " pD4" : i >= 5 ? " pD5" : ""}`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="pRuleHeavy pMastByline pRise pD3">
          <span className="pMono pMastName">{name}</span>
          <span className="pMono pMastRole">{role}</span>
        </div>

        <dl className="pMastMeta pRise pD4">
          {meta.map(([k, v]) => (
            <div key={k} className="pMastMetaRow">
              <dt className="pMono pMastMetaK">{k}</dt>
              <dd className="pMono pMastMetaV">{v}</dd>
            </div>
          ))}
        </dl>
      </Content>
    </Sheet>
  );
}
