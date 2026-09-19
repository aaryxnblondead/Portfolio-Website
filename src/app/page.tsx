import Link from "next/link";
import { Clapboard } from "@/components/Clapboard";
import { Plate } from "@/components/Plate";
import { PhotoBelt } from "@/components/PhotoBelt";
import { WipeIn } from "@/components/Motion";

export const metadata = {
  title: "Aaryan Singh | Machine learning systems",
  description: "Aaryan Singh builds applied machine learning systems for the edge, the cloud, and the space between.",
};

const projects = [
  {
    number: "№ 01",
    title: "Vortex-AI",
    slug: "capstone",
    year: "2026",
    runtime: "Aug 2026 - Present",
    format: "PyTorch / GAT / LSTM / CUDA",
    runOn: "CUDA training, CPU evaluation",
    status: "In progress",
    credit: "Solo",
    metric: { value: "0.83", label: "GAT ROC-AUC" },
    broke:
      "The relationship map still trails the baseline: adjacency MSE 0.0829 against 0.0694. Crisis detection leads at 0.83 ROC-AUC; the map is catching up.",
  },
  {
    number: "№ 02",
    title: "Anora",
    slug: "anora",
    year: "2026",
    runtime: "Oct 2025 - May 2026",
    format: "Flutter / FastAPI / PostgreSQL / TFLite",
    runOn: "AWS App Runner, on-device ARM",
    status: "Shipped",
    credit: "Solo",
    metric: { value: "180ms", label: "Avg on-device inference" },
    broke:
      "The first federated round used a fixed learning rate of 0.01, so the model overfit to a handful of enthusiastic testers and mistagged infrequent writers. Per-client adaptive rates cost two weeks of training.",
  },
  {
    number: "№ 03",
    title: "Vidhaan AI",
    slug: "vidhaanai",
    year: "2025",
    runtime: "Jan 2025 - Apr 2025",
    format: "Django / Bootstrap / SQLite",
    runOn: "Python development server",
    status: "Shipped",
    credit: "Co-founder",
    metric: { value: "3", label: "User roles" },
    broke:
      "The heading detector read bold-italic headers as body text and misclassified 12% of section boundaries. Fixed by retraining on 400 hand-labeled sections from three states.",
  },
  {
    number: "№ 04",
    title: "QualifyAI",
    slug: "resume-analytics",
    year: "2024",
    runtime: "Sep 2024 - Dec 2024",
    format: "FastAPI / React / spaCy / ChromaDB",
    runOn: "AWS ECS / RDS / EFS",
    status: "Shipped",
    credit: "Solo",
    metric: { value: "1,000+", label: "Resumes parsed" },
    broke:
      "Two-column resumes came out as one text stream and broke entity boundaries. Switched to a layout-aware parser with column-gutter detection.",
  },
];

export default function HomePage() {
  return (
    <main id="main" className="neo-site">
      <nav className="neo-nav" aria-label="Site navigation">
        <Link href="/" className="neo-mark">AS / 26</Link>
        <div className="neo-nav-links"><Link href="#work">Work</Link><Link href="/about">About</Link><Link href="#contact">Contact</Link></div>
      </nav>

      <section className="neo-threshold neo-threshold-solo" aria-labelledby="intro-title">
        <div className="neo-threshold-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <div className="neo-threshold-row">
          <div>
            <p className="neo-kicker">Applied machine learning / Mumbai, India</p>
            <h1 id="intro-title" className="neo-display neo-display-solo gateWeave">Aaryan Singh</h1>
            <p className="neo-intro">I build systems that make intelligence useful where the data lives: on device, at the edge, and in the narrow gap between two cloud services.</p>
            <p className="neo-meta-line">MUMBAI · 19°04′N 72°52′E · AVAILABLE / NOV 2026</p>
          </div>
          <div className="neo-hero-plate neo-hero-plate-solo">
            <Plate
              photo="aaryan-suit"
              alt="Aaryan standing outdoors in a grey suit and black shirt, smiling, iron fence and trees behind him"
              size="column"
              ratio="4:5"
              focus="center 20%"
              priority
            />
          </div>
        </div>
      </section>

      <section className="neo-project-stage neo-stage-solo" id="work" aria-labelledby="projects-title">
        <WipeIn delay>
          <div className="neo-section-heading"><span className="neo-index">01</span><h2 id="projects-title" className="neo-heading">Selected work</h2><span className="neo-rule" /></div>
        </WipeIn>

        <div className="slate-grid slate-grid-solo">
          {projects.map((project) => (
            <Clapboard
              key={project.slug}
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
          ))}
        </div>

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
      </section>

      <footer id="contact" className="neo-footer neo-footer-slim">
        <a href="mailto:aaryansingh2810@gmail.com">aaryansingh2810@gmail.com</a>
        <span className="neo-footer-links">
          <a href="https://github.com/aaryxnblondead/" target="_blank" rel="noreferrer noopener">github ↗</a>
          <a href="https://www.linkedin.com/in/aaryan-singh-1b068828b/" target="_blank" rel="noreferrer noopener">linkedin ↗</a>
          <Link href="/about">about ↗</Link>
        </span>
        <span className="neo-muted">Mumbai · 19°04′N 72°52′E</span>
      </footer>
    </main>
  );
}
