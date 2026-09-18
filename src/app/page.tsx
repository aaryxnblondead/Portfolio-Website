import Link from "next/link";
import { DepthGallery } from "@/components/DepthGallery";
import { FilmStrip } from "@/components/FilmStrip";
import { LastListened } from "@/components/LastListened";
import { IconGithub, IconLinkedin } from "@/components/Icons";
import { MetaTable, Metric } from "@/components/Grid";

export const metadata = {
  title: "Aaryan Singh | Machine learning systems",
  description: "Aaryan Singh builds applied machine learning systems for the edge, the cloud, and the space between.",
};

const projects = [
  { number: "01", title: "Anora", slug: "anora", logLine: "Privacy-first wellness journaling with on-device ML inference that syncs across devices without a server in between.", runtime: "Oct 2025 - May 2026", format: "Flutter / FastAPI / PostgreSQL / TFLite", runOn: "AWS App Runner, on-device ARM", status: "Shipped", credit: "Solo", metric: ["180ms", "AVG ON-DEVICE INFERENCE"] },
  { number: "02", title: "VidhaanAI", slug: "vidhaanai", logLine: "A retrieval system for searching, citing, and understanding Indian legal documents.", runtime: "Jan 2025 - Present", format: "Python / FastAPI / Qdrant / LLM", runOn: "Cloud deployment", status: "In progress", credit: "Co-founder", metric: ["92%", "CITATION PRECISION"] },
  { number: "03", title: "Capstone: NIFTY-50 Generative Model", slug: "capstone", logLine: "Conditional diffusion model for NIFTY-50 financial time series, targeting sub-1.2s forecasting latency on edge GPUs.", runtime: "Aug 2025 - Present", format: "PyTorch / ONNX / CUDA / QuantConnect", runOn: "On-device RTX 4090, cloud training", status: "In progress", credit: "Solo", metric: ["1.2s", "TARGET FORECAST LATENCY"] },
  { number: "04", title: "Resume Analytics", slug: "resume-analytics", logLine: "A structured analytics workflow for turning resumes into clearer hiring signals.", runtime: "Mar 2025 - Jun 2025", format: "Python / NLP / Streamlit", runOn: "Browser and local runtime", status: "Shipped", credit: "Solo", metric: ["4x", "FASTER REVIEW WORKFLOW"] },
];

export default function HomePage() {
  return (
    <main id="main" className="neo-site">
      <nav className="neo-nav" aria-label="Site navigation">
        <Link href="/" className="neo-mark">AS / 26</Link>
        <div className="neo-nav-links"><Link href="/about">About</Link><Link href="#contact">Contact</Link></div>
      </nav>

      <section className="neo-threshold" aria-labelledby="intro-title">
        <div className="neo-threshold-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <p className="neo-kicker neo-reveal neo-delay-1">Applied machine learning / Mumbai, India</p>
        <h1 id="intro-title" className="neo-display neo-reveal neo-delay-2 channel-split" data-text="Aaryan Singh">Aaryan Singh</h1>
        <p className="neo-intro neo-reveal neo-delay-3">I build systems that make intelligence useful where the data lives: on device, at the edge, and in the narrow gap between two cloud services.</p>
        <div className="neo-threshold-footer neo-reveal neo-delay-4"><span>SCROLL TO ENTER</span><span className="neo-cross">＋</span><span>AVAILABLE / NOV 2026</span></div>
      </section>

      <FilmStrip />

      <section className="neo-gallery-section" aria-labelledby="gallery-title">
        <div className="neo-section-heading"><span className="neo-index">01</span><h2 id="gallery-title" className="neo-heading channel-split" data-text="Selected work">Selected work</h2><span className="neo-rule" /></div>
        <DepthGallery />
        <div className="neo-project-catalog">
          {projects.map((project) => <article className="neo-project-card" key={project.slug}><div className="neo-project-number">{project.number}</div><h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3><p>{project.logLine}</p><MetaTable rows={[{ label: "RUNTIME", value: project.runtime }, { label: "FORMAT", value: project.format }, { label: "RUN ON", value: project.runOn }, { label: "STATUS", value: project.status }, { label: "CREDIT", value: project.credit }]} /><Metric value={project.metric[0]} label={project.metric[1]} /></article>)}
        </div>
      </section>

      <section className="neo-about-tease" aria-labelledby="about-title">
        <div className="neo-section-heading"><span className="neo-index">02</span><h2 id="about-title" className="neo-heading channel-split" data-text="The person">The person</h2><span className="neo-rule" /></div>
        <div className="neo-about-grid"><div><p className="neo-large-copy">Machine learning engineer. Film festival co-founder. Cataloguer of constraints.</p><p className="neo-muted">Currently working on a diffusion model for NIFTY-50 forecasting and learning causal inference with instrumental variables.</p></div><LastListened /></div>
        <Link href="/about" className="neo-arrow-link">Read the long version <span>↗</span></Link>
      </section>

      <footer id="contact" className="neo-footer"><div><span className="neo-index">03</span><h2 className="neo-heading">Contact.</h2></div><div className="neo-contact-links"><a href="mailto:aaryansingh2810@gmail.com">aaryansingh2810@gmail.com</a><a href="https://github.com/aaryxnblondead/" target="_blank" rel="noreferrer noopener"><IconGithub size={15} /> github.com/aaryxnblondead</a><a href="https://www.linkedin.com/in/aaryan-singh-1b068828b/" target="_blank" rel="noreferrer noopener"><IconLinkedin size={15} /> linkedin.com/in/aaryan-singh</a><a href="https://www.instagram.com/aaryun_/" target="_blank" rel="noreferrer noopener">◎ instagram.com/aaryun_</a></div><span className="neo-muted">Mumbai · India / 19°04′N 72°52′E</span></footer>
    </main>
  );
}