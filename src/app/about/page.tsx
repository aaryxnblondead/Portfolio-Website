import { Plate, PlatePair } from "@/components/Plate";
import { MarketBackdrop } from "@/components/programme/MarketBackdrop";
import { MarqueeRule } from "@/components/programme/ColumnEleven";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";
import { Masthead } from "@/components/programme/Masthead";
import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { AlbumsGrid } from "@/components/programme/AlbumsGrid";
import { AboutIndex, type AboutSection } from "./AboutIndex";
import { SiteFooter } from "@/components/programme/SiteFooter";

export const metadata = {
  title: "About Aaryan Singh",
  description: "Aaryan Singh is an applied machine learning engineer, film festival co-founder, and builder of thoughtful technical systems.",
};

const principles = [
  ["01", "Start with the constraint", "The useful question is usually not what a model can do in theory, but where it has to run, what it cannot expose, and what happens when it fails."],
  ["02", "Keep the system legible", "I like architectures that can be explained on a page: local inference, a clear boundary, a measurable tradeoff, and a human who can still understand the result."],
  ["03", "Make room for the human", "The best technical work does not flatten the people using it. It gives them better context, better tools, and a clearer next decision."],
];

const railLabel = { fontSize: 10, letterSpacing: "0.14em", color: "var(--accent)" } as const;

const sections: AboutSection[] = [
  {
    id: "biography",
    no: "№ 01",
    title: "Biography",
    meta: "02 RECORDS",
    body: (
      <>
        <div className="pRecord">
          <h3 className="pTitle">Figuring out non-obvious solutions</h3>
          <dl className="pMeta">
            <div className="pMetaRow">
              <dt className="pMetaDt">REGISTER</dt>
              <dd className="pMetaDd">Technological? Pataphysical? Artistic?</dd>
            </div>
            <div className="pMetaRow">
              <dt className="pMetaDt">STANCE</dt>
              <dd className="pMetaDd">Down for all challenges</dd>
            </div>
          </dl>
          <p>Technological? Pataphysical? Artistic? I&rsquo;m down for all challenges.</p>
        </div>

        <div className="pRecord" style={{ marginTop: 40 }}>
          <h3 className="pTitle">A technical person with a catalogue instinct.</h3>
          <dl className="pMeta">
            <div className="pMetaRow">
              <dt className="pMetaDt">TRAINING</dt>
              <dd className="pMetaDd">National short film festival, production + sponsorship</dd>
            </div>
            <div className="pMetaRow">
              <dt className="pMetaDt">AFFECTION</dt>
              <dd className="pMetaDd">Sequences, credits, archives, edits</dd>
            </div>
            <div className="pMetaRow">
              <dt className="pMetaDt">METHOD</dt>
              <dd className="pMetaDd">Name the parts, write down what broke</dd>
            </div>
          </dl>
          <p>I co-founded a national short film festival in college and worked on production, sponsorship, and the unglamorous details that make a public experience hold together. It left me with a lasting affection for sequences, credits, archives, and the way a good edit creates meaning.</p>
          <p>That instinct follows me into engineering. I like naming the parts, writing down what broke, and making complicated work easier for the next person to enter.</p>
        </div>
      </>
    ),
  },
  {
    id: "plates",
    no: "№ 02",
    title: "Plates",
    meta: "PL. 01–03",
    body: (
      <>
        <Plate
                  photo="council-crowd"
                  alt="Aaryan smiling in a crowded room wearing a black Students Council hoodie and lanyard, people seated behind him"
                  size="column"
                  ratio="3:2"
                  plate={1}
                  misreg={1}
                  caption="In the crowd instead of on stage for once. The lanyard says hustling Students' Council member. The expression says goof. Neither is Wrong"
                />
        <PlatePair
          plate={2}
          ratio="3:2"
          misreg={3}
          left={{ photo: "council-podium", alt: "Aaryan with eyes closed speaking into a gooseneck microphone at a wooden podium bearing the college crest, wearing a black hoodie" }}
          right={{ photo: "singularity-podium", alt: "Aaryan in a navy blazer speaking at the same wooden podium beside a Crescendo Singularity banner" }}
          caption="Same podium, different briefs. The hoodie talk ran long. The blazer one started on time."
        />
                <Plate
                  photo="portrait-rings"
                  alt="Close-up of Aaryan half covering his face with one hand showing several silver rings, metro lights behind"
                  size="column"
                  ratio="3:2"
                  plate={3}
                  misreg={2}
                  caption="Rings and metro light on the way home. Not a project photo. Kept anyway."
                  meta={{ PLACE: "In transit" }}
                />
      </>
    ),
  },
  {
    id: "method",
    no: "№ 03",
    title: "How I work.",
    meta: "03 RULES",
    body: (
      <section className="pMethod" aria-label="How I work" style={{ marginTop: 0 }}>
        {principles.map(([number, title, detail]) => (
          <article key={number} className="pMethodRow">
            <span className="pMethodNum">{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </section>
    ),
  },
  {
    id: "currently",
    no: "№ 04",
    title: "Currently.",
    meta: "2026",
    body: (
      <div className="pRecord">
        <dl className="pMeta">
          <div className="pMetaRow">
            <dt className="pMetaDt">BUILDING</dt>
            <dd className="pMetaDd">Vortex-AI, a graph-based NIFTY-50 risk and regime system.</dd>
          </div>
          <div className="pMetaRow">
            <dt className="pMetaDt">LEARNING</dt>
            <dd className="pMetaDd">Causal inference with instrumental variables.</dd>
          </div>
          <div className="pMetaRow">
            <dt className="pMetaDt">LISTENING</dt>
            <dd className="pMetaDd">Whatever is on the Spotify panel, usually with a notebook open somewhere nearby.</dd>
          </div>
          <div className="pMetaRow">
            <dt className="pMetaDt">AVAILABLE</dt>
            <dd className="pMetaDd">From November 2026 for data analytics and applied machine learning roles.</dd>
          </div>
        </dl>
      </div>
    ),
  },
  {
    id: "repeat",
    no: "№ 05",
    title: "On repeat.",
    meta: "08 SLEEVES",
    body: (
      <>
        <p style={{ maxWidth: "52ch" }}>
          Eight favourites, filed as inspirations. The arrangements I steal from.
        </p>
        <AlbumsGrid />
      </>
    ),
  },
  {
    id: "contact",
    no: "№ 06",
    title: "Contact.",
    meta: "OPEN CHANNEL",
    body: (
      <section aria-label="Contact">
        <h3 className="pTitle">A good conversation can start small.</h3>
        <p>Send me a project, a difficult systems question, or something technically interesting that you think I should see.</p>
        <p>
          <PataphysicalLink href="mailto:aaryansingh2810@gmail.com">
            aaryansingh2810@gmail.com ↗
          </PataphysicalLink>
        </p>
        <p>
          <PataphysicalLink href="#contact">↓ The form lives in the footer</PataphysicalLink>
        </p>
      </section>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="pAbout">
      <ProgrammeNav
        mark="AS / 26"
        markHref="/"
        links={[
          { label: "Work", href: "/work" },
          { label: "Contact", href: "#contact" },
        ]}
      />

      <main id="main">
        <div className="split-index" id="about-index">
          <aside className="split-side" aria-label="About masthead">
            <div className="split-sticky">
              <Masthead
                word="ABOUT"
                name="Aaryan Singh"
                role="Applied machine learning"
                meta={[
                  ["EDITION", "No. 04"],
                  ["PLACE", "Mumbai"],
                  ["REVISED", "September 2026"],
                  ["FRAMES", "15"],
                ]}
              />
              <p className="split-side-line">COMPUTER ENGINEER / MUMBAI, INDIA</p>
              <p style={{ marginTop: 12 }}>
                <PataphysicalLink href="https://www.instagram.com/aaryun_" target="_blank" rel="noreferrer noopener">
                  Instagram ↗
                </PataphysicalLink>
              </p>
            </div>
          </aside>

          <div className="split-main">
            <p className="pMono" style={{ ...railLabel, marginBottom: 4 }}>
              HOVER TO INSPECT — CLICK TO OPEN
            </p>
            <AboutIndex sections={sections} />
          </div>
        </div>

        <MarqueeRule text="AVAILABLE · NOV 2026" repeat={14} />
      </main>

      <SiteFooter />

      <MarketBackdrop />
    </div>
  );
}
