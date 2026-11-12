import { Plate } from "@/components/Plate";

/** The opening spread: masthead rail, name, catalogue metadata, portrait, intro. */
export function HomeHero() {
  return (
    <div className="pHomeFirst">
      <div className="pHeroBackdrop" aria-hidden="true">
        <span className="pHeroGhost">26</span>
      </div>
      <section className="pHero12" aria-label="Introduction">
        <div className="pHeroRail pMono pEntryRail">
          <div className="pRuleHeavy pMastRailRule">
            <div>№ 00</div>
            <div className="pMastRailSub">MASTHEAD</div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div>№ 01</div>
            <div className="pEntryRailSub">THRESHOLD</div>
            <div className="pEntryRailYear">MUMBAI</div>
          </div>
        </div>

        <div className="pHeroMain">
          <h1 className="pHeroName pRise gateWeave">Aaryan Singh</h1>
          <div className="pRuleHeavy pMastByline pRise pD3">
            <span className="pMono pMastRole">Applied machine learning</span>
          </div>
          <dl className="pMastMeta pRise pD4">
            <div className="pMastMetaRow">
              <dt className="pMono pMastMetaK">EDITION</dt>
              <dd className="pMono pMastMetaV">No. 04</dd>
            </div>
            <div className="pMastMetaRow">
              <dt className="pMono pMastMetaK">PLACE</dt>
              <dd className="pMono pMastMetaV">Mumbai</dd>
            </div>
            <div className="pMastMetaRow">
              <dt className="pMono pMastMetaK">ENTRIES</dt>
              <dd className="pMono pMastMetaV">04</dd>
            </div>
            <div className="pMastMetaRow">
              <dt className="pMono pMastMetaK">AVAILABLE</dt>
              <dd className="pMono pMastMetaV">Nov 2026</dd>
            </div>
          </dl>
        </div>

        <div className="pHeroPhoto pRise pD3">
          <Plate
            photo="aaryan-suit"
            alt="Aaryan standing outdoors in a grey suit and black shirt, smiling, iron fence and trees behind him"
            size="column"
            ratio="4:5"
            focus="center 20%"
            priority
            misreg={2}
          />
        </div>

        <div className="pHeroIntro">
          <p className="pMono pRise pD3" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--accent)" }}>
            Applied machine learning / Mumbai, India
          </p>
          <p className="pHomeIntro pRise pD4">
            I build systems that make intelligence useful where the data lives: on device, at the edge, and in the narrow gap between two cloud services.
          </p>
          <p className="pHomeMetaLine pRise pD5">MUMBAI · 19°04′N 72°52′E · AVAILABLE / NOV 2026</p>
        </div>
      </section>
    </div>
  );
}
