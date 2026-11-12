const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDirectory = path.join(process.cwd(), "src/content/work");

/** Frontmatter of every MDX entry, sorted by slug. */
function getProjects() {
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fileContents = fs.readFileSync(path.join(contentDirectory, file), "utf8");
      const { data } = matter(fileContents);
      return {
        title: data.title || "",
        slug: data.slug || slug,
        logLine: data.logLine || "",
      };
    })
    .sort((a, b) => (a.slug > b.slug ? 1 : -1));
}

module.exports = { getProjects };
