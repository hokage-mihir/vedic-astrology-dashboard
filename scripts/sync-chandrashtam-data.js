/**
 * Keep a rolling 5-year window of pre-calculated Chandrashtam data:
 * the current year through current year + 4. Years outside the window are
 * deleted and every year inside it is regenerated (takes well under a second).
 *
 * Runs automatically before `npm run dev` and `npm run build`, so each deploy
 * rolls the window forward. Files are gitignored; the app also calculates a
 * missing year in the browser as a fallback.
 *
 * Usage: node scripts/sync-chandrashtam-data.js [startYear]
 */

import { buildYearData } from '../src/lib/chandrashtam-calendar.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const WINDOW_YEARS = 5;
const FILE_PATTERN = /^chandrashtam-(\d{4})\.json$/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../src/data');

const startYear = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getUTCFullYear();
const years = Array.from({ length: WINDOW_YEARS }, (_, i) => startYear + i);

fs.mkdirSync(dataDir, { recursive: true });

// Remove years that have rolled out of the window
const removed = [];
for (const file of fs.readdirSync(dataDir)) {
  const match = file.match(FILE_PATTERN);
  if (match && !years.includes(Number(match[1]))) {
    fs.unlinkSync(path.join(dataDir, file));
    removed.push(match[1]);
  }
}

const startTime = Date.now();
for (const year of years) {
  fs.writeFileSync(
    path.join(dataDir, `chandrashtam-${year}.json`),
    JSON.stringify(buildYearData(year), null, 2)
  );
}

console.log(
  `🌙 Chandrashtam data ${years[0]}–${years[years.length - 1]} ready ` +
  `(${Date.now() - startTime} ms)${removed.length ? `, removed ${removed.join(', ')}` : ''}`
);
