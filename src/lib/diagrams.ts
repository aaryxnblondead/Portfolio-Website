import { getProjectNumber } from "@/lib/projects";

/**
 * The architecture diagram for each entry, as data. One node per stage, four
 * tones so the eye can group input / process / guard / output at a glance.
 */

export type DiagramNode = {
  title: string;
  detail: string;
  tone: "input" | "process" | "guard" | "output";
};

export type DiagramSpec = {
  label: string;
  title: string;
  note: string;
  nodes: DiagramNode[];
};

export const diagrams: Record<string, DiagramSpec> = {
  anora: {
    label: `${getProjectNumber("anora")} / TRUST BOUNDARY`,
    title: "The journal never crosses the frame.",
    note: "local inference · encrypted reporting · masked learning",
    nodes: [
      { title: "DEVICE", detail: "Flutter + TFLite", tone: "input" },
      { title: "INFERENCE", detail: "INT8 MentalBERT", tone: "process" },
      { title: "PRIVACY GUARD", detail: "AES / SecAgg", tone: "guard" },
      { title: "BLIND MAILMAN", detail: "FastAPI coordinator", tone: "output" },
    ],
  },
  vidhaanai: {
    label: `${getProjectNumber("vidhaanai")} / PERMISSIONED WORKFLOW`,
    title: "One case, three roles, no open hallway.",
    note: "create · review · decide · track",
    nodes: [
      { title: "LAWYER", detail: "create + submit", tone: "input" },
      { title: "APPLICATION", detail: "documents + status", tone: "process" },
      { title: "JUDGE", detail: "review + decide", tone: "guard" },
      { title: "VIEWER", detail: "case number access", tone: "output" },
    ],
  },
  capstone: {
    label: `${getProjectNumber("capstone")} / MARKET GRAPH`,
    title: "From price history to contagion map.",
    note: "returns · regimes · attention · evaluation",
    nodes: [
      { title: "NIFTY-50", detail: "daily prices", tone: "input" },
      { title: "WINDOWS", detail: "60 trading days", tone: "process" },
      { title: "GAT", detail: "asset attention", tone: "guard" },
      { title: "TWO OUTPUTS", detail: "regime + graph", tone: "output" },
    ],
  },
  "resume-analytics": {
    label: `${getProjectNumber("resume-analytics")} / CANDIDATE SIGNAL`,
    title: "A resume becomes a searchable shape.",
    note: "ingest · extract · index · ask",
    nodes: [
      { title: "RESUMES", detail: "PDF / DOCX", tone: "input" },
      { title: "EXTRACT", detail: "NER + Gemini", tone: "process" },
      { title: "INDEX", detail: "Postgres + Chroma", tone: "guard" },
      { title: "RECRUITER", detail: "semantic query", tone: "output" },
    ],
  },
};
