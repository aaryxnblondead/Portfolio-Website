import Link from "next/link";

/**
 * Slim site nav for the inner pages (work, colophon, index, specimen,
 * lab). Same voice as the homepage nav: mark left, text links right,
 * no icons, no buttons.
 */
export function TopNav() {
  return (
    <nav className="neo-nav" aria-label="Site navigation">
      <Link href="/" className="neo-mark">
        AS / 26
      </Link>
      <div className="neo-nav-links">
        <Link href="/about">About</Link>
        <Link href="/index-page">Index</Link>
        <a href="mailto:aaryansingh2810@gmail.com">Email</a>
      </div>
    </nav>
  );
}
