// Simple icon generator script
// This creates placeholder SVG icons that you can replace with actual designs later

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const generateSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#eab308;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <g transform="translate(${size * 0.5}, ${size * 0.5})">
    <!-- Crescent Moon -->
    <circle cx="0" cy="0" r="${size * 0.25}" fill="white" opacity="0.95"/>
    <circle cx="${size * 0.1}" cy="0" r="${size * 0.25}" fill="url(#grad)"/>
    <!-- Stars -->
    <circle cx="${-size * 0.2}" cy="${-size * 0.15}" r="${size * 0.02}" fill="white"/>
    <circle cx="${size * 0.15}" cy="${-size * 0.2}" r="${size * 0.015}" fill="white"/>
    <circle cx="${size * 0.2}" cy="${size * 0.15}" r="${size * 0.02}" fill="white"/>
  </g>
</svg>
`;

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const svgFilename = `icon-${size}x${size}.svg`;

  // Save as SVG (can be used directly or converted to PNG later)
  fs.writeFileSync(path.join(publicDir, svgFilename), svg);
  console.log(`✓ Generated ${svgFilename}`);
});

console.log('\nNote: SVG files generated. For best results, convert these to PNG using an image tool.');
console.log('You can use an online tool like https://cloudconvert.com/svg-to-png or ImageMagick:');
console.log('  for i in public/icon-*.svg; do convert "$i" "${i%.svg}.png"; done');
