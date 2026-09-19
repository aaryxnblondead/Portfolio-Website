import { Plate } from "@/components/Plate";
import { PhotoBelt } from "@/components/PhotoBelt";
import { Clapboard } from "@/components/Clapboard";
import { SlideIn } from "@/components/Motion";
import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { Sheet, Rail, Content, Bleed } from "@/components/programme/Sheet";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";
import { PROJECTS } from "@/lib/projects";
import { SiteFooter } from "@/components/programme/SiteFooter";

export const metadata = {
  title: "Aaryan Singh | Machine learning systems",
  description: "Aaryan Singh builds applied machine learning systems for the edge, the cloud, and the space between.",
};

export default function HomePage() {
  return (
    <div className="pHome">
      <ProgrammeNav
        mark="AS / 26"
        links={[
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "#contact" },
        ]}
      />

      <main id="main">
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

        <Sheet as="section" className="pHomeStage" aria-labelledby="projects-title">
          <Rail className="pMono pEntryRail">
            <div>№ 02</div>
            <div className="pEntryRailSub">SELECTED WORK</div>
            <div className="pEntryRailYear">04 ENTRIES</div>
          </Rail>

          <Content>
            <div className="pHomeStageHead">
              <h2 id="projects-title">Selected work</h2>
              <PataphysicalLink href="/work">Full programme ↗</PataphysicalLink>
            </div>

            <div className="slate-grid" style={{ marginTop: 32 }}>
              {PROJECTS.map((project, i) => (
                <SlideIn key={project.slug} delayMs={Math.min(i, 4) * 60}>
                  <Clapboard
                    number={project.number}
                    year={project.year}
                    section="ENGINEERING"
                    title={project.title}
                    href={`/work/${project.slug}`}
                    metadata={[
                      ["RUNTIME", project.runtime],
                      ["FORMAT", project.format],
                      ["RUN ON", project.runOn],
                      ["STATUS", project.status],
                      ["CREDIT", project.credit],
                    ]}
                    metric={project.metric}
                    broke={project.broke}
                  />
                </SlideIn>
              ))}
            </div>
          </Content>

          <Bleed aria-hidden="true" />
        </Sheet>

        <PhotoBelt
          label="Reading + group frames + Samvad run"
          start={1}
          items={[
            { photo: "airport-reading", alt: "Two paperbacks held up in an airport waiting area: The Great Indian Novel and Don't Believe Everything You Think" },
            { photo: "council-group", alt: "Thirteen Students Council members posing together outdoors at dusk, most in black T-shirts with lanyards" },
            { photo: "cinecrce-crew", alt: "The CineCRCE production crew in black T-shirts with lanyards posing together under a shelter at night" },
            { photo: "cinecrce-screen", alt: "The CineCRCE Short Film Festival title card projected on the Samvad auditorium screen" },
            { photo: "samvad-audience", alt: "A full Samvad auditorium of red chairs facing a stage with two speakers and an OnPoint banner on screen" },
            { photo: "friends-garden", alt: "Six friends posing on a garden path outside a stone college building, one in a white turban" },
            { photo: "street-play", alt: "Two performers in white kurtas and red scarves mid-scene before a watching crowd" },
            { photo: "fest-group", alt: "Fest crew group selfie in front of an event banner at Fr. Conceicao Rodrigues College" },
            { photo: "lights-pair", alt: "Two friends arm in arm under strings of lanterns on a court at night" },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
