import Link from "next/link";
import { TopNav } from "@/components/TopNav";

export const metadata = {
  title: "404 | Aaryan Singh",
  description: "Page not found.",
};

const LEFT = Array.from({ length: 6 }, () => "Not found");
const RIGHT = Array.from({ length: 6 }, () => "404");

/**
 * Set like a record sleeve that repeats its title until the words become
 * texture, with the actual message wedged between the columns. The
 * repeated lines are decoration; the card carries the real heading.
 */
export default function NotFound() {
  return (
    <main id="main" className="py-32">
      <TopNav />
      <div className="lost">
        <div className="lost-repeat" aria-hidden="true">
          <div>
            {LEFT.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
          <div className="lost-right">
            {RIGHT.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        </div>
        <div className="lost-card">
          <span className="neo-index">404</span>
          <h1 className="text-masthead-desktop font-fraunces-light text-ink mb-4">Not found</h1>
          <p className="text-body text-ink mb-8">
            The page you are looking for does not exist. It may have been moved, or it was never built.
          </p>
          <Link href="/" className="text-accent font-space-mono">
            Return to index
          </Link>
        </div>
      </div>
    </main>
  );
}
