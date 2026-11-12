#!/usr/bin/env node
/**
 * photos/ -> public/photos/ + src/lib/photo-manifest.json
 *
 * Does three things:
 *   1. Grades every source photo so it reads lively on a warm paper surface
 *      (lifts shadows, opens midtones, adds saturation and a touch of warmth).
 *   2. Emits AVIF / WebP / JPEG derivatives at five widths.
 *   3. Writes a manifest with dimensions, srcsets, a dominant colour and a
 *      20px blurred LQIP so the mount never flashes empty paper.
 *
 * Run:  npm run photos
 * Deps: npm i -D sharp
 *
 * Per-photo overrides live in photos/grade.json, e.g.
 *   { "anora-lobby": { "saturation": 1.42, "lift": 12, "warmth": 0.06 } }
 */

import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { BASE_GRADE, INPUT_RE, slugify } from './photos/config.mjs';
import { derivePhoto } from './photos/derive.mjs';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'photos');
const OUT_DIR = path.join(ROOT, 'public', 'photos');
const MANIFEST = path.join(ROOT, 'src', 'lib', 'photo-manifest.json');
const GRADE_FILE = path.join(SRC_DIR, 'grade.json');

async function loadOverrides() {
  if (!existsSync(GRADE_FILE)) return {};
  try {
    return JSON.parse(await readFile(GRADE_FILE, 'utf8'));
  } catch {
    console.warn('  ! photos/grade.json is not valid JSON — ignoring it');
    return {};
  }
}

async function processOne(file, overrides) {
  const slug = slugify(file);
  const g = { ...BASE_GRADE, ...(overrides[slug] ?? {}) };
  const entry = await derivePhoto({
    slug,
    input: path.join(SRC_DIR, file),
    outDir: OUT_DIR,
    g,
  });
  return [slug, entry];
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No ${path.relative(ROOT, SRC_DIR)}/ directory found.`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const overrides = await loadOverrides();
  const files = (await readdir(SRC_DIR)).filter((f) => INPUT_RE.test(f)).sort();

  if (files.length === 0) {
    console.error(`No images in ${path.relative(ROOT, SRC_DIR)}/.`);
    process.exit(1);
  }

  const manifest = {};
  for (const file of files) {
    process.stdout.write(`  ${file} … `);
    try {
      const [slug, entry] = await processOne(file, overrides);
      manifest[slug] = entry;
      console.log(`${entry.width}×${entry.height}  ${entry.tone}`);
    } catch (err) {
      console.log(`failed — ${err.message}`);
    }
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    `\n${Object.keys(manifest).length} photo(s) → public/photos/, manifest → src/lib/photo-manifest.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
