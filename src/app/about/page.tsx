import Link from "next/link";
import { Plate, Portrait } from "@/components/Plate";
import { ScrollMarket } from "@/components/ScrollMarket";
import { ContactForm } from "@/components/ContactForm";

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
    <main className="neo-site neo-inner neo-about-page">
      <nav className="neo-nav" aria-label="About navigation">
        <Link href="/" className="neo-mark">AS / 26</Link>
        <div className="neo-nav-links"><Link href="/">Work</Link><Link href="#contact">Contact</Link></div>
      </nav>

      <aside className="neo-about-sticky">
        <span className="neo-index">ABOUT / 00</span>
        <h1 className="neo-display">Aaryan</h1>
        <p className="neo-muted">Computer Engineer / Mumbai, India</p>
        <a className="neo-about-social" href="https://www.instagram.com/aaryun_" target="_blank" rel="noreferrer noopener">Instagram ↗</a>
        <div className="neo-about-portrait">
          <Portrait
            photo="aaryan-portrait"
            alt="Aaryan sitting on wide stone steps in the evening light, wearing a black T-shirt and grey trousers, smiling"
            credit="Stone steps, evening light. Mumbai, 2025"
          />
        </div>
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
          <p>
            The group frames live elsewhere: title card, red chairs, and crew after strike run as a{" "}
            <Link href="/#offscreen">film belt on the homepage</Link>.
          </p>

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
          </div>
        </section>

        <section className="neo-principles">
          <span className="neo-index">03</span>
          <h2 className="neo-heading">How I work.</h2>
          {principles.map(([number, title, detail]) => <article key={number}><span className="neo-index">{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}
        </section>

        <section className="neo-about-now">
          <span className="neo-index">04</span>
          <h2 className="neo-heading">Currently.</h2>
          <dl>
            <div><dt>BUILDING</dt><dd>Vortex-AI, a graph-based NIFTY-50 risk and regime system.</dd></div>
            <div><dt>LEARNING</dt><dd>Causal inference with instrumental variables.</dd></div>
            <div><dt>LISTENING</dt><dd>Whatever is on the Spotify panel, usually with a notebook open somewhere nearby.</dd></div>
            <div><dt>AVAILABLE</dt><dd>From November 2026 for data analytics and applied machine learning roles.</dd></div>
          </dl>
        </section>

        <section id="contact" className="neo-about-end">
          <span className="neo-index">06</span>
          <h2 className="neo-heading">A good conversation can start small.</h2>
          <p>Send me a project, a difficult systems question, or something technically interesting that you think I should see.</p>
          <a className="neo-arrow-link" href="mailto:aaryansingh2810@gmail.com">aaryansingh2810@gmail.com ↗</a>
          <ContactForm />
        </section>
      </div>

      <ScrollMarket />
    </main>
  );
}
