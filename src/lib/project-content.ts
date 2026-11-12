import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { PROJECT_ORDER } from "@/lib/projects";

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

async function getProjectSlugs(): Promise<string[]> {
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
    .sort((a, b) => PROJECT_ORDER.indexOf(a.slug as (typeof PROJECT_ORDER)[number]) - PROJECT_ORDER.indexOf(b.slug as (typeof PROJECT_ORDER)[number]));
}
