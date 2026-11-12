import { MetaTable } from "@/components/Grid";

/** The printed record: runtime/format/run-on/status, the field notes, the source. */
export function ProjectDetails({
  slug,
  metadata,
  htmlContent,
}: {
  slug: string;
  metadata: { runtime: string; format: string; runOn: string; status: string };
  htmlContent: string;
}) {
  return (
    <section id="details" className="project-details" aria-label="Project details">
      <MetaTable
        rows={[
          { label: "RUNTIME", value: metadata.runtime },
          { label: "FORMAT", value: metadata.format },
          { label: "RUN ON", value: metadata.runOn },
          { label: "STATUS", value: metadata.status },
        ]}
      />

      <div
        className="prose text-ink max-w-prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <p className="pMono" style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.1em" }}>
        <a
          href={`https://github.com/aaryxnblondead/${slug}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Repository ↗
        </a>
      </p>
    </section>
  );
}
