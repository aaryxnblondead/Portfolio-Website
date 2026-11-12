import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";

/**
 * MDX body -> HTML string. The pages inject the result with
 * dangerouslySetInnerHTML, so every entry renders through the same pipeline
 * and no content file can import a React component.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = remark()
    .use(gfm)
    // @ts-ignore - type conflict between unified versions in remark packages
    .use(footnotes, {
      placement: "inline",
      footnoteLabel: "Footnotes",
      footnoteLabelTagName: "h3",
      footnoteTagTagName: "details",
      footnoteBackLabel: "Back to reference",
    })
    .use(html, { allowDangerousHtml: true });
  return processor.processSync(markdown).toString();
}
