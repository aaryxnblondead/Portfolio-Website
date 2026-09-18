import Link from "next/link";
import { TopNav } from "@/components/TopNav";

const experiments = [
  {
    number: "001",
    title: "VidhaanAI retrieval",
    detail: "FIRs in, cited answers out. A multilingual RAG pass over IPC-to-BNS mappings.",
    constraint: "Three PDFs and a badly OCR'd portal",
    tag: "RAG / EVALUATION",
    status: "Shipped",
    href: "/work/vidhaanai",
  },
  {
    number: "002",
    title: "Edge inference notes",
    detail: "What survives without the cloud. Quantized inference inside a phone app.",
    constraint: "10MB bundle, 200ms, zero round-trips",
    tag: "TFLITE / ARM",
    status: "Shipped",
    href: "/work/anora",
  },
  {
    number: "003",
    title: "NIFTY diffusion",
    detail: "Forecasting as a generative problem. Regimes first, prices second.",
    constraint: "16GB GPU, two-second backtest steps",
    tag: "PYTORCH / TIME SERIES",
    status: "In progress",
    href: "/work/capstone",
  },
  {
    number: "004",
    title: "Resume signal",
    detail: "A smaller system for a noisy decision. Parsing and search over real resumes.",
    constraint: "1,000+ PDFs, no GPU",
    tag: "NLP / ANALYTICS",
    status: "Shipped",
    href: "/work/resume-analytics",
  },
];

export const metadata = {
  title: "Lab | Aaryan Singh",
  description: "Working notes: four experiments, each with a number, a constraint, and a reason to exist.",
};

export default function LabPage() {
  return (
    <main className="neo-site neo-inner">
      <TopNav />
      <header className="neo-inner-header">
        <span className="neo-index">LAB / 00</span>
        <h1 className="neo-display channel-split" data-text="Working notes">
          Working notes
        </h1>
        <p className="neo-large-copy">Experiments with a number, a constraint, and a reason to exist.</p>
        <p className="neo-lab-count">Four entries. Every one loads somewhere on this site.</p>
      </header>
      <div className="neo-lab-index">
        {experiments.map((exp) => (
          <article className="neo-lab-row" key={exp.number}>
            <span className="neo-index">{exp.number}</span>
            <div>
              <h2 className="neo-subheading channel-split" data-text={exp.title}>
                <Link href={exp.href}>{exp.title}</Link>
              </h2>
              <p>{exp.detail}</p>
              <p className="neo-lab-constraint">Constraint: {exp.constraint}</p>
            </div>
            <span className="neo-muted">
              <span className="neo-lab-tag">{exp.tag}</span>
              <span className={`neo-lab-status${exp.status === "In progress" ? " is-live" : ""}`}>
                {exp.status}
              </span>
            </span>
            <Link href={exp.href} className="neo-arrow" aria-label={`Open ${exp.title}`}>
              ↗
            </Link>
          </article>
        ))}
      </div>
      <div className="neo-lab-outro">
        <Link href="/" className="neo-arrow-link">
          ← Return home
        </Link>
        <Link href="/index-page" className="neo-arrow-link">
          Browse the index <span>↗</span>
        </Link>
      </div>
    </main>
  );
}
