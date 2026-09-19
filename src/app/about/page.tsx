import Link from "next/link";
import { Plate, PlatePair } from "@/components/Plate";
import { ScrollMarket } from "@/components/ScrollMarket";
import { ContactForm } from "@/components/ContactForm";
import { CatalogueEntry } from "@/components/programme/CatalogueEntry";
import { MarqueeRule } from "@/components/programme/ColumnEleven";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";
import { Masthead } from "@/components/programme/Masthead";
import { OrnateFrame } from "@/components/programme/OrnateFrame";
import { Perforations } from "@/components/programme/Analogue";

export const metadata = {
  title: "About Aaryan Singh",
  description: "Aaryan Singh is an applied machine learning engineer, film festival co-founder, and builder of thoughtful technical systems.",
};

const principles = [
  ["01", "Start with the constraint", "The useful question is usually not what a model can do in theory, but where it has to run, what it cannot expose, and what happens when it fails."],
  ["02", "Keep the system legible", "I like architectures that can be explained on a page: local inference, a clear boundary, a measurable tradeoff, and a human who can still understand the result."],
  ["03", "Make room for the human", "The best technical work does not flatten the people using it. It gives them better context, better tools, and a clearer next decision."],
];

export default function AboutPage() {
  return (
    <main id="main" className="neo-site neo-inner">
      <nav className="neo-nav" aria-label="About navigation">
        <Link href="/" className="neo-mark">AS / 26</Link>
        <div className="neo-nav-links"><Link href="/">Work</Link><Link href="#contact">Contact</Link></div>
      </nav>

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

      <div className="neo-about-page">
        <aside className="neo-about-sticky">
          <span className="neo-index">ABOUT / 00</span>
          <p className="neo-muted">Computer Engineer / Mumbai, India</p>
          <PataphysicalLink href="https://www.instagram.com/aaryun_" target="_blank" rel="noreferrer noopener" className="neo-about-social">Instagram ↗</PataphysicalLink>
          <div className="neo-about-portrait">
            <OrnateFrame
              photo="aaryan-portrait"
              alt="Aaryan sitting on wide stone steps in the evening light"
              caption="Stone steps, evening light. The only framed photograph on the site."
            />
          </div>
          <Perforations axis="y" className="neo-about-perfs" />
        </aside>

        <div className="neo-about-story">
          <section className="neo-about-opening">
            <span className="neo-index">01</span>
            <p className="neo-large-copy">Figuring out non-obvious solutions</p>
            <p>Technological? Pataphysical? Artistic? I&rsquo;m down for all challenges.</p>
          </section>

          <section>
            <span className="neo-index">02</span>
            <h2 className="neo-heading">A technical person with a catalogue instinct.</h2>
            <p>I co-founded a national short film festival in college and worked on production, sponsorship, and the unglamorous details that make a public experience hold together. It left me with a lasting affection for sequences, credits, archives, and the way a good edit creates meaning.</p>
            <p>That instinct follows me into engineering. I like naming the parts, writing down what broke, and making complicated work easier for the next person to enter.</p>

            <div className="neo-about-plates">
              <Plate
                photo="council-crowd"
                alt="Aaryan smiling in a crowded room wearing a black Students Council hoodie and lanyard, people seated behind him"
                size="column"
                ratio="natural"
                plate={1}
                caption="In the crowd instead of on stage, which is where I prefer to sit. The lanyard says staff. The expression says interval."
              />

              <Plate
                photo="portrait-rings"
                alt="Close-up of Aaryan half covering his face with one hand showing several silver rings, metro lights behind"
                size="column"
                ratio="natural"
                plate={2}
                caption="Rings and metro light on the way home. Not a project photo. Kept anyway."
                meta={{ PLACE: "In transit" }}
              />

              <PlatePair
                plate={3}
                ratio="3:2"
                left={{ photo: "council-podium", alt: "Aaryan with eyes closed speaking into a gooseneck microphone at a wooden podium bearing the college crest, wearing a black hoodie" }}
                right={{ photo: "singularity-podium", alt: "Aaryan in a navy blazer speaking at the same wooden podium beside a Crescendo Singularity banner" }}
                caption="Same podium, different briefs. The hoodie talk ran long. The blazer one started on time."
              />
            </div>
          </section>

          <section className="neo-principles">
            <span className="neo-index">03</span>
            <h2 className="neo-heading">How I work.</h2>
            {principles.map(([number, title, detail]) => <article key={number}><span className="neo-index">{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}
          </section>

          <section className="neo-about-now">
            <CatalogueEntry
              number="№ 04"
              title="Currently."
              year="2026"
              section="NOW"
              metadata={[
                ["BUILDING", "Vortex-AI, a graph-based NIFTY-50 risk and regime system."],
                ["LEARNING", "Causal inference with instrumental variables."],
                ["LISTENING", "Whatever is on the Spotify panel, usually with a notebook open somewhere nearby."],
                ["AVAILABLE", "From November 2026 for data analytics and applied machine learning roles."],
              ]}
            />
          </section>

          <MarqueeRule text="AVAILABLE · NOV 2026" repeat={14} />

          <section id="contact" className="neo-about-end">
            <span className="neo-index">06</span>
            <h2 className="neo-heading">A good conversation can start small.</h2>
            <p>Send me a project, a difficult systems question, or something technically interesting that you think I should see.</p>
            <a className="neo-arrow-link" href="mailto:aaryansingh2810@gmail.com">aaryansingh2810@gmail.com ↗</a>
            <ContactForm />
          </section>
        </div>
      </div>

      <ScrollMarket />
    </main>
  );
}
