type DiagramNode = {
  title: string;
  detail: string;
  tone: "input" | "process" | "guard" | "output";
};

type DiagramSpec = {
  label: string;
  title: string;
  note: string;
  nodes: DiagramNode[];
};

const diagrams: Record<string, DiagramSpec> = {
  anora: {
    label: "01 / TRUST BOUNDARY",
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
    label: "02 / PERMISSIONED WORKFLOW",
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
    label: "03 / MARKET GRAPH",
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
    label: "04 / CANDIDATE SIGNAL",
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

export function ProjectDiagram({ slug }: { slug: string }) {
  const diagram = diagrams[slug];
  if (!diagram) return null;

  const width = 960;
  const height = 330;
  const nodeWidth = 178;
  const nodeHeight = 112;
  const left = 46;
  const gap = (width - left * 2 - nodeWidth * diagram.nodes.length) / (diagram.nodes.length - 1);
  const markerId = `arrow-${slug}`;

  return (
    <figure className={`project-diagram project-diagram-${slug}`}>
      <div className="project-diagram-topline">
        <span>{diagram.label}</span>
        <span>ARCHITECTURE / FIELD NOTES</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={diagram.title}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <text className="project-diagram-title" x="46" y="42">{diagram.title}</text>
        <text className="project-diagram-note" x="46" y="66">{diagram.note}</text>
        {diagram.nodes.map((node, index) => {
          const x = left + index * (nodeWidth + gap);
          const centerY = 190;
          return (
            <g key={node.title} className={`project-diagram-node is-${node.tone}`}>
              {index < diagram.nodes.length - 1 && (
                <path className="project-diagram-connector" d={`M${x + nodeWidth} ${centerY}H${x + nodeWidth + gap - 14}`} markerEnd={`url(#${markerId})`} />
              )}
              <rect x={x} y={centerY - nodeHeight / 2} width={nodeWidth} height={nodeHeight} />
              <text className="project-diagram-index" x={x + 16} y={centerY - 28}>{String(index + 1).padStart(2, "0")}</text>
              <text className="project-diagram-node-title" x={x + 16} y={centerY + 4}>{node.title}</text>
              <text className="project-diagram-node-detail" x={x + 16} y={centerY + 28}>{node.detail}</text>
            </g>
          );
        })}
        <path className="project-diagram-baseline" d={`M${left} 278H${width - left}`} />
        <circle className="project-diagram-reel" cx={width - left - 12} cy="278" r="6" />
      </svg>
      <div className="project-diagram-mobile-flow" aria-label={`${diagram.title} mobile workflow`}>
        {diagram.nodes.map((node, index) => (
          <div key={node.title}>
            <div className={`project-diagram-mobile-node is-${node.tone}`}>
              <span className="project-diagram-mobile-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{node.title}</strong>
              <small>{node.detail}</small>
            </div>
            {index < diagram.nodes.length - 1 && <span className="project-diagram-mobile-arrow" aria-hidden="true">↓</span>}
          </div>
        ))}
      </div>
      <figcaption className="text-meta font-space-mono text-ink-muted">{diagram.label} / {diagram.title}</figcaption>
    </figure>
  );
}
