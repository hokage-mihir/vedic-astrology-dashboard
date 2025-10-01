/**
 * Script to generate pre-calculated Chandrashtam data for a year
 * Run this with: node scripts/generate-chandrashtam-data.js [year]
 *
 * This will create a JSON file with all Chandrashtam periods for each Rashi
 * The file can then be imported by the app for instant lookups
 */

import { calculateAllChandrashtamForYear } from '../src/lib/chandrashtam-calendar.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get year from command line args or use current year
const year = process.argv[2] ? parseInt(process.argv[2]) : new Date().getFullYear();

console.log(`\n🌙 Generating Chandrashtam data for ${year}...\n`);
console.log('This may take a few minutes as we calculate precise transit times.\n');

const startTime = Date.now();

try {
    // Calculate all periods
    const allPeriods = calculateAllChandrashtamForYear(year);

    // Convert Date objects to ISO strings for JSON serialization
    const serializable = {};
    Object.keys(allPeriods).forEach(rashi => {
        serializable[rashi] = allPeriods[rashi].map(period => ({
            start: period.start.toISOString(),
            end: period.end.toISOString(),
            duration: period.duration,
            incomplete: period.incomplete || false
        }));
    });

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    const outputPath = path.join(dataDir, `chandrashtam-${year}.json`);
    const output = {
        year: year,
        generatedAt: new Date().toISOString(),
        data: serializable
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('✅ Generation complete!\n');
    console.log('📊 Summary:');
    Object.keys(allPeriods).forEach(rashi => {
        const count = allPeriods[rashi].length;
        console.log(`   ${rashi}: ${count} periods`);
    });
    console.log(`\n⏱️  Time elapsed: ${elapsed}s`);
    console.log(`📁 Output: ${outputPath}\n`);

} catch (error) {
    console.error('❌ Error generating data:', error);
    process.exit(1);
}
