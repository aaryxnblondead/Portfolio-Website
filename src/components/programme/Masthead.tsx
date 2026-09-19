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

const PASSES: Pass[] = [
  { width: "pWdth62", x: "0em", treat: "solid" },
  { width: "pWdth100", x: "0.05em", treat: "outline" },
  { width: "pWdth125", x: "-0.02em", treat: "solid" },
  { width: "pWdth88", x: "0.03em", treat: "knockout" },
  { width: "pWdth125", x: "-0.04em", treat: "orange" },
  { width: "pWdth62", x: "-0.16em", treat: "outline" },
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
}: {
  word?: string;
  name?: string;
  role?: string;
  meta?: [string, string][];
}) {
  return (
    <Sheet as="header" className="pMasthead">
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

        <div aria-hidden="true" className="pWall">
          {PASSES.map((pass, i) => (
            <span
              key={i}
              style={{ transform: `translateX(${pass.x})` }}
              className={`pWallPass ${pass.width} ${TREATMENT[pass.treat]}`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="pRuleHeavy pMastByline">
          <span className="pMono pMastName">{name}</span>
          <span className="pMono pMastRole">{role}</span>
        </div>

        <dl className="pMastMeta">
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
