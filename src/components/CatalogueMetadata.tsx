import { ReactNode } from "react";

interface CatalogueMetadataProps {
  runtime: string;
  format: string;
  runOn: string;
  status: string;
  credit: string;
  className?: string;
}

export function CatalogueMetadata({
  runtime,
  format,
  runOn,
  status,
  credit,
  className,
}: CatalogueMetadataProps) {
  return (
    <table className={`meta-table ${className || ""}`}>
      <tbody>
        <tr className="meta-table-row">
          <dt>RUNTIME</dt>
          <dd>{runtime}</dd>
        </tr>
        <tr className="meta-table-row">
          <td>FORMAT</td>
          <dd>{format}</dd>
        </tr>
        <tr className="meta-table-row">
          <td>RUN ON</td>
          <dd>{runOn}</dd>
        </tr>
        <tr className="meta-table-row">
          <td>STATUS</td>
          <dd>{status}</dd>
        </tr>
        <tr className="meta-table-row">
          <td>CREDIT</td>
          <dd>{credit}</dd>
        </tr>
      </tbody>
    </table>
  );
}