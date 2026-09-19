export const PROJECT_ORDER = ["capstone", "anora", "vidhaanai", "resume-analytics"] as const;

export type ProjectSlug = (typeof PROJECT_ORDER)[number];

export const PROJECT_NUMBERS: Record<ProjectSlug, string> = {
  capstone: "01",
  anora: "02",
  vidhaanai: "03",
  "resume-analytics": "04",
};

export function getProjectNumber(slug: string): string {
  return PROJECT_NUMBERS[slug as ProjectSlug] ?? "00";
}

export type ProjectRecord = {
  number: string;
  title: string;
  slug: string;
  year: string;
  runtime: string;
  format: string;
  runOn: string;
  status: string;
  credit: string;
  metric: { value: string; label: string };
  broke: string;
};

/** Single source of truth for the catalogue. Home index and /work read here. */
export const PROJECTS: ProjectRecord[] = [
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
