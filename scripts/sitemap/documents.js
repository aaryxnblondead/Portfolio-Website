const fs = require("fs");
const path = require("path");

const SITE_URL = "https://aaryansingh.com";

/** Every public URL, with the same build timestamp. */
function buildPages(projects, lastmod) {
  return [
    { url: "/", lastmod },
    { url: "/index-page", lastmod },
    { url: "/colophon", lastmod },
    { url: "/specimen", lastmod },
    ...projects.map((project) => ({ url: `/work/${project.slug}`, lastmod })),
  ];
}

function urlEntry(page) {
  return `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.url === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
}

function buildSitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(urlEntry).join("")}
</urlset>
`;
}

function buildRobots() {
  return `# www.robotstxt.org
User-agent: *
Allow: /
Disallow: /specimen
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/** sitemap.xml + robots.txt, written together because they must agree. */
function writeFeeds(publicDir, pages) {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(pages));
  fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobots());
}

module.exports = { buildPages, writeFeeds };
