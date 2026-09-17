import Link from "next/link";
import { Grid, Rail, ContentColumn, SectionNumber } from "@/components/Grid";

export const metadata = {
  title: "404 | Aaryan Singh",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <main id="main" className="py-32">
      <Grid>
        <Rail>
          <SectionNumber number="404" />
        </Rail>
        <ContentColumn>
          <h1 className="text-masthead-desktop font-fraunces-light text-ink mb-4">
            Not found
          </h1>
          <p className="text-body text-ink mb-8">
            The page you are looking for does not exist. It may have been moved, or it was never built.
          </p>
          <Link href="/" className="text-accent font-space-mono">
            Return to index
          </Link>
        </ContentColumn>
      </Grid>
    </main>
  );
}