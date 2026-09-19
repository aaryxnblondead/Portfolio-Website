import { Sheet, Rail, Content, FullBleed } from "./Sheet";

/**
 * The one flat field: an academy-leader countdown on solid accent, used
 * once per page as the break between the engineering catalogue and
 * everything after it. A pause, never a destination — no links inside.
 */

const LEADER = ["8", "7", "6", "5"];

export function IntermissionSlate({
  label = "INTERMISSION",
  line = "The second half is off-screen.",
  footnote = "No explanation is offered for the arrangement of this programme.",
  duration = "00:09:00",
}: {
  label?: string;
  line?: string;
  footnote?: string;
  duration?: string;
}) {
  return (
    <FullBleed as="aside" className="pSlate" aria-label={label}>
      <Sheet className="pSlatePad">
        <Rail className="pSlateRail">
          <div className="pSlateRailRule">
            <div>{label}</div>
            <div>{duration}</div>
          </div>
        </Rail>

        <Content>
          <div aria-hidden="true" className="pLeader">
            {LEADER.map((n, i) => {
              const last = i === LEADER.length - 1;
              return (
                <span
                  key={n}
                  className={`pLeaderNum ${last ? "pWdth125 is-last" : "pWdth62"}${
                    last ? "" : " pStrokePaper"
                  }`}
                >
                  {n}
                </span>
              );
            })}
          </div>

          <p className="pSlateLine">{line}</p>
          <p className="pSlateFoot">{footnote}</p>
        </Content>

        <div className="pBleed pSlateCueWrap">
          <div className="pSlateCue" aria-hidden="true" />
          <span className="pSlateCueLabel">CUE</span>
        </div>
      </Sheet>

      <div className="pSlateBand" aria-hidden="true" />
    </FullBleed>
  );
}
