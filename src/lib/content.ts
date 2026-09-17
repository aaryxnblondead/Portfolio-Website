import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";

const contentDirectory = join(process.cwd(), "src/content/work");

export interface ProjectMetadata {
  title: string;
  slug: string;
  logLine: string;
  runtime: string;
  format: string;
  runOn: string;
  status: string;
  credit: string;
  metric: {
    value: string;
    label: string;
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  const files = readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  return {
    metadata: {
      title: data.title || "",
      slug: data.slug || realSlug,
      logLine: data.logLine || "",
      runtime: data.runtime || "",
      format: data.format || "",
      runOn: data.runOn || "",
      status: data.status || "",
      credit: data.credit || "",
      metric: data.metric || { value: "", label: "" },
    },
    content,
  };
}

export async function getAllProjects(): Promise<ProjectMetadata[]> {
  const slugs = await getProjectSlugs();
  const projects = await Promise.all(
    slugs.map((slug) => getProjectBySlug(slug))
  );

  return projects
    .map((project) => project.metadata)
    .sort((a, b) => (a.slug > b.slug ? 1 : -1));
}

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