import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/project-content";
import { markdownToHtml } from "@/lib/markdown";
import { getProjectNumber } from "@/lib/projects";
import { ProjectEntry } from "@/components/project/ProjectEntry";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return notFound();

  return {
    title: project.metadata.title,
    description: project.metadata.logLine,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { metadata, content } = project;

  return (
    <ProjectEntry
      metadata={metadata}
      htmlContent={await markdownToHtml(content)}
      number={getProjectNumber(metadata.slug)}
    />
  );
}
