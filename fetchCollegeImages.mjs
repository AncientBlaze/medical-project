/**
 * fetchCollegeImages.mjs
 * ----------------------
 * Run once from your project root:
 *   node fetchCollegeImages.mjs
 *
 * What it does:
 *  1. Tries Wikipedia REST API for each college → grabs thumbnail
 *  2. Falls back to a deterministic Unsplash medical photo
 *  3. Writes the patched array back to src/data/indiaCollegeData.js
 *
 * Requirements: Node 18+ (built-in fetch). No npm installs needed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Config ────────────────────────────────────────────────────────────────────
const DATA_FILE = './data/indiaCollegeData.js';
const DELAY_MS  = 120;   // polite delay between Wikipedia requests
const WIKI_MIN_WIDTH = 200; // ignore tiny logos/icons

// Deterministic Unsplash fallbacks — medical / campus themed
const FALLBACKS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=75',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=75',
  'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=75',
  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=75',
  'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=75',
  'https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=600&q=75',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=75',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=75',
];
const fallback = (id) => FALLBACKS[id % FALLBACKS.length];

// ── Wikipedia helper ──────────────────────────────────────────────────────────
async function wikiImage(collegeName) {
  // Strip parenthetical noise for a cleaner search title
  const clean = collegeName
    .replace(/\(.*?\)/g, '')
    .replace(/,.*$/, '')
    .trim();

  const url =
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CollegeImageFetcher/1.0 (educational project)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const thumb = data?.originalimage || data?.thumbnail;
    if (thumb && thumb.width >= WIKI_MIN_WIDTH) return thumb.source;
    return null;
  } catch {
    return null;
  }
}

// ── Sleep helper ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Dynamically import the college data
  const __dir = path.dirname(fileURLToPath(import.meta.url));
  const absPath = path.resolve(__dir, DATA_FILE);

  if (!fs.existsSync(absPath)) {
    console.error(`❌  File not found: ${absPath}`);
    process.exit(1);
  }

  // Read raw JS and extract the array via eval trick (safe — it's your own file)
  const raw = fs.readFileSync(absPath, 'utf-8');

  // Dynamically import it as a module
  const { indiaColleges } = await import(absPath);

  console.log(`\n🏥  Fetching images for ${indiaColleges.length} colleges...\n`);

  const patched = [];
  let wikiHits = 0, fallbackHits = 0;

  for (let i = 0; i < indiaColleges.length; i++) {
    const college = indiaColleges[i];

    // Skip colleges with obviously bad names (MP/Maharashtra header rows)
    const skipNames = ['State', 'Madhya Pradesh', 'Maharashtra'];
    if (skipNames.includes(college.name)) {
      patched.push({ ...college, image: fallback(college.id) });
      fallbackHits++;
      process.stdout.write(`  [${i + 1}/${indiaColleges.length}] ${college.name.slice(0, 50).padEnd(50)} → 🎨 fallback\n`);
      continue;
    }

    const img = await wikiImage(college.name);
    await sleep(DELAY_MS);

    if (img) {
      patched.push({ ...college, image: img });
      wikiHits++;
      process.stdout.write(`  [${i + 1}/${indiaColleges.length}] ${college.name.slice(0, 50).padEnd(50)} → ✅ wiki\n`);
    } else {
      patched.push({ ...college, image: fallback(college.id) });
      fallbackHits++;
      process.stdout.write(`  [${i + 1}/${indiaColleges.length}] ${college.name.slice(0, 50).padEnd(50)} → 🎨 fallback\n`);
    }
  }

  // ── Write patched file ──────────────────────────────────────────────────────
  const newContent =
    `export const indiaColleges =\n` +
    JSON.stringify(patched, null, 2) +
    `;\n\n\nexport const INDIA_STATES = [\n` +
    `  "Andhra Pradesh",\n` +
    `  "Bihar",\n` +
    `  "Chhattisgarh",\n` +
    `  "Delhi",\n` +
    `  "Gujarat",\n` +
    `  "Haryana",\n` +
    `  "Himachal Pradesh",\n` +
    `  "Jammu & Kashmir",\n` +
    `  "Jharkhand",\n` +
    `  "Karnataka",\n` +
    `  "Kerala",\n` +
    `  "Madhya Pradesh",\n` +
    `  "Maharashtra",\n` +
    `  "Manipur",\n` +
    `  "Meghalaya",\n` +
    `  "Odisha",\n` +
    `  "Pondicherry",\n` +
    `  "Punjab",\n` +
    `  "Rajasthan",\n` +
    `  "West Bengal"\n` +
    `];\n`;

  // Backup original
  fs.writeFileSync(absPath + '.bak', raw, 'utf-8');
  console.log(`\n💾  Backed up original → ${absPath}.bak`);

  fs.writeFileSync(absPath, newContent, 'utf-8');

  console.log(`\n✅  Done!`);
  console.log(`   Wikipedia images : ${wikiHits}`);
  console.log(`   Fallback images  : ${fallbackHits}`);
  console.log(`   Written to       : ${absPath}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
