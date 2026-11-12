const path = require("path");
const { getProjects } = require("./sitemap/projects");
const { buildPages, writeFeeds } = require("./sitemap/documents");

function generateSitemap() {
  const pages = buildPages(getProjects(), new Date().toISOString());
  writeFeeds(path.join(process.cwd(), "public"), pages);
  console.log("Generated sitemap.xml and robots.txt");
}

generateSitemap();
