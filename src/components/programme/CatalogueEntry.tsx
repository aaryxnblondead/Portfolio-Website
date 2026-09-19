import { Sheet, Rail, Content } from "./Sheet";
import { PataphysicalLink } from "./PataphysicalLink";

/**
 * A catalogue record with a fixed metadata block, bounded by 2px rules.
 * The record is the skeleton; entries on this site carry no photograph,
 * so the liveliness comes from the title interaction and the failure log,
 * which is prose and set as prose.
 */

const CUTOUTS = ["pCutoutA", "pCutoutB", "pCutoutC"];
const TILTS = ["pTiltA", "pTiltB", "pTiltC"];

export function CatalogueEntry({
  index = 0,
  number,
  title,
  year,
  section = "ENGINEERING",
  metadata = [],
  image,
  alt = "",
  broke,
  href,
}: {
  index?: number;
  number: string;
  title: string;
  year: string;
  section?: string;
  metadata?: [string, string][];
  image?: string;
  alt?: string;
  broke?: string;
  /** Omit for records that are not destinations — the title renders plain. */
  href?: string;
}) {
  const cutout = CUTOUTS[index % CUTOUTS.length];
  const plateCut = CUTOUTS[(index + 1) % CUTOUTS.length];
  const tilt = TILTS[index % TILTS.length];

  return (
    <Sheet as="article" className="pEntry">
      <Rail className="pMono pEntryRail">
        <div>{number}</div>
        <div className="pEntryRailSub">{section}</div>
        <div className="pEntryRailYear">{year}</div>
      </Rail>

      <Content className="pEntryContent">
        <div className="pRecord">
          <h2 className="pTitle">
            {href ? <PataphysicalLink href={href}>{title}</PataphysicalLink> : title}
          </h2>

          <dl className="pMeta">
            {metadata.map(([label, value]) => (
              <div key={label} className="pMetaRow">
                <dt className="pMetaDt">{label}</dt>
                <dd className="pMetaDd">{value}</dd>
              </div>
            ))}
          </dl>

          {broke && (
            <div className="pBroke">
              <span className="pBrokeLabel">WHAT BROKE</span>
              <p>{broke}</p>
            </div>
          )}
        </div>
      </Content>

      {image && (
        <div className="pCutWrap">
          <div className={`pCutTilt ${tilt}`}>
            <span aria-hidden="true" className={`pPlate ${plateCut}`} />
            <img src={image} alt={alt} loading="lazy" className={`pCutImg ${cutout}`} />
          </div>
          {alt && <p className="pCutCaption">{alt}</p>}
        </div>
      )}
    </Sheet>
  );
}
