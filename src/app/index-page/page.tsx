import Link from "next/link";
import { Grid, Rail, ContentColumn, SectionNumber } from "@/components/Grid";

export const metadata = {
  title: "Index | Aaryan Singh",
  description: "Alphabetical index of technologies, methods, and tools mentioned across the portfolio.",
};

const indexEntries: { term: string; references: { url: string; label: string }[] }[] = [
  {
    term: "Android",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "Anora",
    references: [{ url: "/work/anora", label: "Project: Anora" }],
  },
  {
    term: "ChromaDB",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "CUDA",
    references: [{ url: "/work/capstone", label: "Capstone" }],
  },
  {
    term: "FastAPI",
    references: [{ url: "/work/anora", label: "Anora" }],
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
    term: "Gemini",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "INT8 quantization",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "LangChain",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "NER",
    references: [{ url: "/work/resume-analytics", label: "Resume Analytics Platform" }],
  },
  {
    term: "OCR",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "ONNX",
    references: [{ url: "/work/capstone", label: "Capstone" }],
  },
  {
    term: "PyTorch",
    references: [{ url: "/work/capstone", label: "Capstone" }],
  },
  {
    term: "RAG",
    references: [
      { url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" },
      { url: "/work/resume-analytics", label: "Resume Analytics Platform" },
    ],
  },
  {
    term: "Secure aggregation",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "TFLite",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "tabular-nums",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "Tesseract OCR",
    references: [{ url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
  {
    term: "Vision Transformer",
    references: [{ url: "/work/anora", label: "Anora" }],
  },
  {
    term: "font-feature-settings",
    references: [{ url: "/colophon", label: "Colophon" }],
  },
  {
    term: "tabular figures",
    references: [{ url: "/work/anora", label: "Anora" }, { url: "/work/vidhaanai", label: "VidhaanAI / Bail Reckoner" }],
  },
];

export default function IndexPage() {
  return (
    <main id="main" className="py-16">
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
                      <Link href={ref.url} className="text-accent no-underline">
                        {ref.label}
                      </Link>
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