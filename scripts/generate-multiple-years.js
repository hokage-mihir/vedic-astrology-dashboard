/**
 * Script to generate Chandrashtam data for multiple years at once
 * Run this with: node scripts/generate-multiple-years.js [startYear] [endYear]
 *
 * Example: node scripts/generate-multiple-years.js 2025 2030
 */

import { calculateAllChandrashtamForYear } from '../src/lib/chandrashtam-calendar.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get years from command line args
const startYear = process.argv[2] ? parseInt(process.argv[2]) : new Date().getFullYear();
const endYear = process.argv[3] ? parseInt(process.argv[3]) : startYear;

if (startYear > endYear) {
  console.error('❌ Error: Start year must be less than or equal to end year');
  process.exit(1);
}

const years = [];
for (let year = startYear; year <= endYear; year++) {
  years.push(year);
}

console.log(`\n🌙 Generating Chandrashtam data for ${years.length} year(s): ${years.join(', ')}\n`);

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const totalStartTime = Date.now();
const results = [];

for (const year of years) {
  console.log(`\n📅 Processing ${year}...`);
  const startTime = Date.now();

  try {
    const allPeriods = calculateAllChandrashtamForYear(year);

    // Convert Date objects to ISO strings
    const serializable = {};
    Object.keys(allPeriods).forEach(rashi => {
      serializable[rashi] = allPeriods[rashi].map(period => ({
        start: period.start.toISOString(),
        end: period.end.toISOString(),
        duration: period.duration,
        incomplete: period.incomplete || false
      }));
    });

    const outputPath = path.join(dataDir, `chandrashtam-${year}.json`);
    const output = {
      year: year,
      generatedAt: new Date().toISOString(),
      data: serializable
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalPeriods = Object.values(allPeriods).reduce((sum, periods) => sum + periods.length, 0);

    results.push({
      year,
      totalPeriods,
      elapsed,
      path: outputPath
    });

    console.log(`   ✅ Complete: ${totalPeriods} periods in ${elapsed}s`);

  } catch (error) {
    console.error(`   ❌ Error processing ${year}:`, error);
    results.push({
      year,
      error: error.message
    });
  }
}

const totalElapsed = ((Date.now() - totalStartTime) / 1000).toFixed(2);

console.log('\n' + '='.repeat(60));
console.log('📊 Generation Summary');
console.log('='.repeat(60));

results.forEach(result => {
  if (result.error) {
    console.log(`\n❌ ${result.year}: FAILED - ${result.error}`);
  } else {
    console.log(`\n✅ ${result.year}:`);
    console.log(`   Periods: ${result.totalPeriods}`);
    console.log(`   Time: ${result.elapsed}s`);
    console.log(`   File: ${path.basename(result.path)}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`⏱️  Total time: ${totalElapsed}s`);
console.log(`📁 Output directory: ${dataDir}`);
console.log('='.repeat(60) + '\n');

const successCount = results.filter(r => !r.error).length;
console.log(`🎉 Successfully generated data for ${successCount}/${years.length} year(s)\n`);
