export const PROJECT_ORDER = ["capstone", "anora", "vidhaanai", "resume-analytics"] as const;

export type ProjectSlug = (typeof PROJECT_ORDER)[number];

export const PROJECT_NUMBERS: Record<ProjectSlug, string> = {
  capstone: "01",
  anora: "02",
  vidhaanai: "03",
  "resume-analytics": "04",
};

export function getProjectNumber(slug: string): string {
  return PROJECT_NUMBERS[slug as ProjectSlug] ?? "00";
}
