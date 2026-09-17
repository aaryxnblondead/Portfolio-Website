const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDirectory = path.join(process.cwd(), "src/content/work");

function getAllProjects() {
  const files = fs.readdirSync(contentDirectory);
  const projects = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        title: data.title || "",
        slug: data.slug || slug,
        logLine: data.logLine || "",
      };
    });
  return projects.sort((a, b) => (a.slug > b.slug ? 1 : -1));
}

function generateSitemap() {
  const projects = getAllProjects();

  const pages = [
    { url: "/", lastmod: new Date().toISOString() },
    { url: "/index-page", lastmod: new Date().toISOString() },
    { url: "/colophon", lastmod: new Date().toISOString() },
    { url: "/specimen", lastmod: new Date().toISOString() },
    ...projects.map((project) => ({
      url: `/work/${project.slug}`,
      lastmod: new Date().toISOString(),
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>https://aaryansingh.com${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.url === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>
`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

  const robotsTxt = `# www.robotstxt.org
User-agent: *
Allow: /
Disallow: /specimen
Sitemap: https://aaryansingh.com/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt);

  console.log("Generated sitemap.xml and robots.txt");
}

generateSitemap();