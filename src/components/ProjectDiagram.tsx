import type { CSSProperties } from "react";
import { diagrams, type DiagramNode } from "@/lib/diagrams";

/** Desktop geometry of the architecture strip, in viewBox units. */
const WIDTH = 960;
const HEIGHT = 330;
const NODE_WIDTH = 178;
const NODE_HEIGHT = 112;
const LEFT = 46;
const CENTER_Y = 190;

/** The same flow, stacked, for narrow screens. */
function MobileFlow({ nodes, title }: { nodes: DiagramNode[]; title: string }) {
  return (
    <div className="project-diagram-mobile-flow" aria-label={`${title} mobile workflow`}>
      {nodes.map((node, index) => (
        <div
          key={node.title}
          style={{ "--ndx": index } as CSSProperties}
          className="project-diagram-mobile-step"
        >
          <div className={`project-diagram-mobile-node is-${node.tone}`}>
            <span className="project-diagram-mobile-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{node.title}</strong>
            <small>{node.detail}</small>
          </div>
          {index < nodes.length - 1 && (
            <span className="project-diagram-mobile-arrow" aria-hidden="true">↓</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProjectDiagram({ slug }: { slug: string }) {
  const diagram = diagrams[slug];
  if (!diagram) return null;

  const { nodes } = diagram;
  const gap = (WIDTH - LEFT * 2 - NODE_WIDTH * nodes.length) / (nodes.length - 1);
  const markerId = `arrow-${slug}`;

  return (
    <figure className={`project-diagram project-diagram-${slug}`}>
      <div className="project-diagram-topline">
        <span>{diagram.label}</span>
        <span>ARCHITECTURE / FIELD NOTES</span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={diagram.title}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <text className="project-diagram-title" x="46" y="42">{diagram.title}</text>
        <text className="project-diagram-note" x="46" y="66">{diagram.note}</text>
        {nodes.map((node, index) => {
          const x = LEFT + index * (NODE_WIDTH + gap);
          return (
            <g
              key={node.title}
              className={`project-diagram-node is-${node.tone}`}
              style={{ "--ndx": index } as CSSProperties}
            >
              {index < nodes.length - 1 && (
                <path
                  className="project-diagram-connector"
                  d={`M${x + NODE_WIDTH} ${CENTER_Y}H${x + NODE_WIDTH + gap - 14}`}
                  markerEnd={`url(#${markerId})`}
                />
              )}
              <rect x={x} y={CENTER_Y - NODE_HEIGHT / 2} width={NODE_WIDTH} height={NODE_HEIGHT} />
              <text className="project-diagram-index" x={x + 16} y={CENTER_Y - 28}>{String(index + 1).padStart(2, "0")}</text>
              <text className="project-diagram-node-title" x={x + 16} y={CENTER_Y + 4}>{node.title}</text>
              <text className="project-diagram-node-detail" x={x + 16} y={CENTER_Y + 28}>{node.detail}</text>
            </g>
          );
        })}
        <path className="project-diagram-baseline" d={`M${LEFT} 278H${WIDTH - LEFT}`} />
        <circle className="project-diagram-reel" cx={WIDTH - LEFT - 12} cy="278" r="6" />
      </svg>
      <MobileFlow nodes={nodes} title={diagram.title} />
      <figcaption className="text-meta font-space-mono text-ink-muted">{diagram.label} / {diagram.title}</figcaption>
    </figure>
  );
}
