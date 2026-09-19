import Link from "next/link";
import { Grid, Rail, ContentColumn, SectionNumber } from "@/components/Grid";
import { TopNav } from "@/components/TopNav";
import { PataphysicalLink } from "@/components/programme/PataphysicalLink";

export const metadata = {
  title: "Index | Aaryan Singh",
  description: "Alphabetical index of technologies, methods, and tools mentioned across the portfolio.",
};

const indexEntries: { term: string; references: { url: string; label: string }[] }[] = [
  {
    term: "AES-256",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Android",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Archivo",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "AWS",
    references: [
      { url: "/work/anora", label: "Anora" },
      { url: "/work/resume-analytics", label: "QualifyAI" },
    ],
  },
  {
    term: "Bootstrap",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "Celery",
    references: [{ url: "/work/resume-analytics", label: "QualifyAI" }],
  },
  {
    term: "ChromaDB",
    references: [{ url: "/work/resume-analytics", label: "QualifyAI" }],
  },
  {
    term: "CUDA",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "Django",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "FastAPI",
    references: [
      { url: "/work/anora", label: "Anora" },
      { url: "/work/resume-analytics", label: "QualifyAI" },
    ],
  },
  {
    term: "Federated learning",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Flutter",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "GAT",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "Gemini",
    references: [
      { url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" },
      { url: "/work/resume-analytics", label: "QualifyAI" },
    ],
  },
  {
    term: "INT8 quantization",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "LSTM",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "MDX",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "MentalBERT",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "NER",
    references: [{ url: "/work/resume-analytics", label: "QualifyAI" }],
  },
  {
    term: "Neue Machina",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "Next.js",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "NIFTY-50",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "OCR",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "Pearson correlation",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "pdfplumber",
    references: [
      { url: "/work/resume-analytics", label: "QualifyAI" },
      { url: "/colophon", label: "Colophon" },
    ],
  },
  {
    term: "PostgreSQL",
    references: [
      { url: "/work/anora", label: "Anora" },
      { url: "/work/resume-analytics", label: "QualifyAI" },
    ],
  },
  {
    term: "PyMuPDF",
    references: [
      { url: "/work/resume-analytics", label: "QualifyAI" },
      { url: "/colophon", label: "Colophon" },
    ],
  },
  {
    term: "PyTorch",
    references: [{ url: "/work/capstone", label: "Vortex-AI" }],
  },
  {
    term: "RAG",
    references: [
      { url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" },
      { url: "/work/resume-analytics", label: "QualifyAI" },
    ],
  },
  {
    term: "React",
    references: [{ url: "/work/resume-analytics", label: "QualifyAI" }],
  },
  {
    term: "Secure aggregation",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Space Mono",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "spaCy",
    references: [{ url: "/work/resume-analytics", label: "QualifyAI" }],
  },
  {
    term: "SQLite",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "Tailwind CSS",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "TensorFlow Federated",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "TFLite",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Vercel",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
];

export default function IndexPage() {
  return (
    <main id="main" className="py-16">
      <TopNav />
      <Grid>
        <Rail>
          <SectionNumber number="IN" />
        </Rail>
        <ContentColumn>
          <h1 className="text-h1-desktop text-ink mb-8">Index</h1>
          <p className="text-small text-ink-muted font-space-mono mb-8">
            Alphabetical index of technologies, methods, and tools mentioned across the site.
          </p>

          <div className="grid-cols-1 md-grid-cols-2 gap-x-12 gap-y-2">
            {indexEntries.map((entry) => (
              <div key={entry.term} className="border-b border-rule pt-1 pb-1">
                <div className="label text-meta text-ink-muted font-space-mono">{entry.term}</div>
                <div className="value mt-1">
                  {entry.references.map((ref, i) => (
                    <span key={i} className="text-small">
                      <PataphysicalLink href={ref.url} variant="ink">
                        {ref.label}
                      </PataphysicalLink>
                      {i < entry.references.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-rule">
            <Link href="/" className="text-accent text-meta font-space-mono no-underline">
              &larr; Back to home
            </Link>
          </div>
        </ContentColumn>
      </Grid>
    </main>
  );
}