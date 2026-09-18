import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  className?: string;
}

export function Grid({ children, className }: GridProps) {
  return (
    <div className={`grid-12 ${className || ""}`}>
      {children}
    </div>
  );
}

interface RailProps {
  children: ReactNode;
  className?: string;
}

export function Rail({ children, className }: RailProps) {
  return (
    <aside className={`rail ${className || ""}`}>
      {children}
    </aside>
  );
}

interface ContentColumnProps {
  children: ReactNode;
  className?: string;
}

export function ContentColumn({ children, className }: ContentColumnProps) {
  return (
    <div className={`content-col ${className || ""}`}>
      {children}
    </div>
  );
}

interface RuleProps {
  thickness?: "1px" | "2px";
  className?: string;
}

export function Rule({ thickness = "1px", className }: RuleProps) {
  const classes = thickness === "2px" ? "rule-2" : "rule";
  return (
    <div
      className={`${classes} ${className || ""}`}
      style={{ height: thickness }}
      aria-hidden="true"
    />
  );
}

interface SectionRuleProps {
  className?: string;
}

export function SectionRule({ className }: SectionRuleProps) {
  return (
    <div
      className={`rule-2 ${className || ""}`}
      style={{ height: "2px" }}
      aria-hidden="true"
    />
  );
}

interface MetaTableProps {
  rows: { label: string; value: string }[];
  className?: string;
}

export function MetaTable({ rows, className }: MetaTableProps) {
  return (
    <table className={`meta-table ${className || ""}`}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="meta-table-row">
            <th>{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface SectionNumberProps {
  number: string;
  className?: string;
}

export function SectionNumber({ number, className }: SectionNumberProps) {
  return (
    <div
      className={`section-number ${className || ""}`}
      aria-hidden="true"
    >
      {number}
    </div>
  );
}

interface MetricProps {
  value: string;
  label: string;
  className?: string;
}

export function Metric({ value, label, className }: MetricProps) {
  return (
    <div className={`text-right ${className || ""}`}>
      <div className="text-metric text-ink font-space-mono-bold">
        {value}
      </div>
      <div className="text-meta text-ink-muted">
        {label}
      </div>
    </div>
  );
}