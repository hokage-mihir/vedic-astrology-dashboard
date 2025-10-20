# Complete Migration Guide: Vite + React → Next.js 15 with Swiss Ephemeris

This comprehensive guide will help you migrate your Vedic Astrology Dashboard from Vite + React to Next.js 15, enabling Swiss Ephemeris calculations with full Node.js runtime support on Cloudflare Pages.

## Table of Contents
1. [Why Migrate?](#why-migrate)
2. [Prerequisites](#prerequisites)
3. [Migration Overview](#migration-overview)
4. [Step-by-Step Migration](#step-by-step-migration)
5. [Project Structure Comparison](#project-structure-comparison)
6. [Component Migration](#component-migration)
7. [Swiss Ephemeris API Setup](#swiss-ephemeris-api-setup)
8. [Client-Side Data Fetching](#client-side-data-fetching)
9. [Cloudflare Deployment](#cloudflare-deployment)
10. [Testing & Validation](#testing--validation)
11. [Rollback Plan](#rollback-plan)

---

## Why Migrate?

### Benefits of Next.js + Swiss Ephemeris

| Feature | Current (Vite + astronomia) | After (Next.js + Swiss Ephemeris) |
|---------|----------------------------|-----------------------------------|
| **Accuracy** | Good (astronomia) | Industry-standard (Swiss Ephemeris) |
| **Calculation Engine** | Pure JavaScript | NASA JPL data, professional-grade |
| **Server-Side** | None | API routes for calculations |
| **Ayanamsa** | Manual calculation | Native Lahiri support |
| **Planet Support** | Moon, Sun | All planets + Rahu/Ketu |
| **Performance** | Client-side only | Server-side caching possible |
| **SEO** | Client-side rendering | SSR/SSG available |
| **Cloudflare** | Works (Pages) | Works (Pages + Node.js runtime) |

### Key Advantages
- ✅ **95% of your code is reusable** - Components, UI, styles, constants
- ✅ **Swiss Ephemeris works** - Full Node.js runtime on Cloudflare
- ✅ **Better architecture** - Separation of concerns (UI vs calculations)
- ✅ **Future-proof** - Easy to add more planets, features
- ✅ **Same deployment** - Still Cloudflare Pages
- ✅ **Progressive Web App** - Keep PWA features with next-pwa

---

## Prerequisites

### Required Tools
```bash
# Node.js 18+ (check your version)
node --version  # Should be v18.0.0 or higher

# npm or pnpm
npm --version   # or pnpm --version
```

### Knowledge Required
- React fundamentals (you already have this)
- Basic understanding of API routes
- Familiarity with async/await

---

## Migration Overview

### What Gets Copied (No Changes)
```
✅ All React components (95% as-is)
✅ UI components (card, tooltip, alert, etc.)
✅ Styles and Tailwind configuration
✅ Constants (vedic-constants.js, rashi-symbols.js)
✅ Utility functions (utils.js)
✅ Contexts (NotificationContext)
✅ Hooks (useReducedMotion)
✅ Assets (icons, images)
✅ PWA configuration (adapted for next-pwa)
```

### What Gets Refactored
```
🔄 Calculation libraries → API routes
🔄 Direct imports → API fetch calls
🔄 Vite config → Next.js config
🔄 Index.html → app/layout.jsx
🔄 main.jsx → app/page.jsx
```

### Estimated Time
- **Initial setup**: 30 minutes
- **Component migration**: 1-2 hours
- **API route setup**: 1 hour
- **Testing**: 1-2 hours
- **Total**: 4-6 hours

---

## Step-by-Step Migration

### Step 1: Create New Next.js Project

```bash
# Navigate to parent directory
cd ~/vedic-astrology-dashboard/..

# Create new Next.js 15 project
npx create-next-app@latest vedic-astrology-nextjs

# During setup, choose:
✓ TypeScript? → No (keep JavaScript)
✓ ESLint? → Yes
✓ Tailwind CSS? → Yes
✓ `src/` directory? → No (use app/ directory)
✓ App Router? → Yes
✓ Customize import alias? → No

cd vedic-astrology-nextjs
```

### Step 2: Install Dependencies

```bash
# Install Swiss Ephemeris
npm install swisseph-v2

# Install other dependencies from your current app
npm install framer-motion lucide-react clsx tailwind-merge suncalc

# Install Cloudflare adapter
npm install @opennextjs/cloudflare

# Install Next PWA (optional, for PWA features)
npm install @ducanh2912/next-pwa
```

### Step 3: Copy Project Files

Create this directory structure and copy files:

```bash
# From your current project root, run these commands:

# Copy all components
cp -r src/components app/components

# Copy UI components
mkdir -p app/components/ui
cp -r src/components/ui/* app/components/ui/

# Copy lib utilities (except calculators)
mkdir -p app/lib
cp src/lib/utils.js app/lib/
cp src/lib/vedic-constants.js app/lib/
cp src/lib/rashi-symbols.js app/lib/

# Copy contexts
mkdir -p app/contexts
cp src/contexts/* app/contexts/

# Copy hooks
mkdir -p app/hooks
cp src/hooks/* app/hooks/

# Copy data
mkdir -p app/data
cp src/data/locations.js app/data/

# Copy public assets
cp -r public/* public/

# Copy Tailwind config
cp tailwind.config.js tailwind.config.js
cp postcss.config.js postcss.config.js
```

---

## Project Structure Comparison

### Current Structure (Vite + React)
```
vedic-astrology-dashboard/
├── public/
│   ├── icon-*.png
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── App.jsx
│   │   ├── NakshatraInfo.jsx
│   │   ├── ChandrashtamCalculator.jsx
│   │   └── ... (all other components)
│   ├── contexts/
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   └── useReducedMotion.js
│   ├── lib/
│   │   ├── astro-calculator.js      ← Calculations here
│   │   ├── sun-calculator.js
│   │   ├── chandrashtam-calculator.js
│   │   ├── vedic-constants.js
│   │   └── utils.js
│   ├── data/
│   │   └── locations.js
│   ├── main.jsx                      ← Entry point
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── tailwind.config.js
```

### New Structure (Next.js 15)
```
vedic-astrology-nextjs/
├── public/
│   ├── icon-*.png
│   └── favicon.ico
├── app/
│   ├── api/                          ← NEW: API routes
│   │   ├── calculate/
│   │   │   └── route.js              ← Swiss Ephemeris API
│   │   ├── sun-times/
│   │   │   └── route.js              ← Sunrise/sunset API
│   │   └── chandrashtam/
│   │       └── route.js              ← Chandrashtam API
│   ├── components/                   ← COPIED from src/components
│   │   ├── ui/
│   │   ├── NakshatraInfo.jsx
│   │   ├── ChandrashtamCalculator.jsx
│   │   └── ... (all components)
│   ├── contexts/                     ← COPIED from src/contexts
│   │   └── NotificationContext.jsx
│   ├── hooks/                        ← COPIED from src/hooks
│   │   └── useReducedMotion.js
│   ├── lib/                          ← Utilities + Server-only code
│   │   ├── swisseph.js               ← NEW: Server-side Swiss Ephemeris
│   │   ├── sun-calculator.js         ← COPIED (works as-is)
│   │   ├── chandrashtam-calculator.js
│   │   ├── vedic-constants.js        ← COPIED
│   │   └── utils.js                  ← COPIED
│   ├── data/                         ← COPIED from src/data
│   │   └── locations.js
│   ├── layout.jsx                    ← NEW: Root layout (replaces index.html)
│   ├── page.jsx                      ← NEW: Main page (replaces App.jsx)
│   └── globals.css                   ← NEW: Global styles (from index.css)
├── next.config.mjs                   ← NEW: Next.js config
├── package.json
└── tailwind.config.js                ← COPIED
```

---

## Component Migration

### Components That Work As-Is (No Changes)

These components can be copied directly without modifications:

```
✅ CosmicLoader.jsx
✅ ErrorBoundary.jsx
✅ InstallPrompt.jsx
✅ LocationRashiBar.jsx
✅ SimpleLocationRashiBar.jsx
✅ MoonPhase.jsx
✅ NotificationSettings.jsx
✅ NotificationSettingsNoHover.jsx
✅ OfflineIndicator.jsx
✅ ProgressRing.jsx
✅ RashiStatusCard.jsx
✅ SimplifiedLandingPage.jsx
✅ TimezoneSelector.jsx
✅ WelcomeBanner.jsx
✅ All UI components (alert, card, tooltip, etc.)
```

### Components That Need Minor Updates

#### 1. Components Using Calculations

**Files:**
- `NakshatraInfo.jsx`
- `ChandrashtamCalculator.jsx`
- `PanchangDetails.jsx`
- `PersonalStatusCard.jsx`
- `RahuKalamCard.jsx`
- `ChandrashtamAnnualView.jsx`

**Change Pattern:**

**Before (Vite):**
```javascript
import { calculateMoonPosition, calculateSunPosition } from '../lib/astro-calculator.js';

function NakshatraInfo() {
  const moonData = calculateMoonPosition();
  const sunData = calculateSunPosition();
  // ... use data
}
```

**After (Next.js):**
```javascript
'use client';  // Add this at the top for client components

import { useState, useEffect } from 'react';

function NakshatraInfo() {
  const [moonData, setMoonData] = useState(null);
  const [sunData, setSunData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: new Date().toISOString() })
        });
        const data = await response.json();
        setMoonData(data.moon);
        setSunData(data.sun);
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <CosmicLoader />;
  if (!moonData || !sunData) return <ErrorState />;

  // ... rest of component logic stays the same
}
```

#### 2. App.jsx → page.jsx

**Current App.jsx:**
```javascript
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import SimplifiedLandingPage from './components/SimplifiedLandingPage';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <SimplifiedLandingPage />
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
```

**New app/page.jsx:**
```javascript
'use client';

import SimplifiedLandingPage from './components/SimplifiedLandingPage';

export default function Home() {
  return <SimplifiedLandingPage />;
}
```

**New app/layout.jsx:**
```javascript
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Moon Mood - Vedic Astrology Dashboard',
  description: 'Track Chandrashtam periods and cosmic influences on consciousness with Vedic astrology',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Import Path Updates

Update all imports to use Next.js conventions:

**Before:**
```javascript
import { calculateMoonPosition } from '../lib/astro-calculator.js';
import NotificationContext from '../contexts/NotificationContext';
import { Card } from './ui/card';
```

**After:**
```javascript
// API calls instead of direct imports for calculations
import NotificationContext from '@/app/contexts/NotificationContext';
import { Card } from '@/app/components/ui/card';

// Or use relative imports
import NotificationContext from '../contexts/NotificationContext';
import { Card } from './ui/card';
```

---

## Swiss Ephemeris API Setup

### Step 1: Create Server-Side Swiss Ephemeris Module

**File: `app/lib/swisseph.js`**

```javascript
import Swisseph from 'swisseph-v2';

// Set Lahiri ayanamsa for Vedic astrology
Swisseph.swe_set_sid_mode(Swisseph.SE_SIDM_LAHIRI, 0, 0);

// Use Moshier ephemeris (no file downloads required)
const EPHE_FLAG = Swisseph.SEFLG_MOSEPH | Swisseph.SEFLG_SPEED | Swisseph.SEFLG_SIDEREAL;

const normalize360 = (degrees) => {
  degrees = degrees % 360;
  return degrees < 0 ? degrees + 360 : degrees;
};

/**
 * Convert Date to Julian Day
 */
export function dateToJulianDay(date) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hour = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;

  return Swisseph.swe_julday(year, month, day, hour, Swisseph.SE_GREG_CAL);
}

/**
 * Calculate planetary position
 */
export async function calculatePlanetPosition(planet, date) {
  const julianDay = dateToJulianDay(date);

  return new Promise((resolve, reject) => {
    try {
      const result = Swisseph.swe_calc_ut(julianDay, planet, EPHE_FLAG);

      if (result.error) {
        reject(new Error(result.error));
        return;
      }

      const siderealLongitude = normalize360(result.longitude);
      const rashiNumber = Math.floor(siderealLongitude / 30);
      const degreesInRashi = siderealLongitude % 30;

      resolve({
        longitude: siderealLongitude,
        degrees_in_rashi: degreesInRashi,
        rashi_number: rashiNumber,
        speed: result.longitudeSpeed,
        latitude: result.latitude,
        distance: result.distance
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Calculate Moon position
 */
export async function calculateMoonPosition(date = new Date()) {
  const moonData = await calculatePlanetPosition(Swisseph.SE_MOON, date);
  const julianDay = dateToJulianDay(date);
  const ayanamsa = Swisseph.swe_get_ayanamsa_ut(julianDay);

  return {
    ...moonData,
    ayanamsa,
    raw_longitude: moonData.longitude + ayanamsa
  };
}

/**
 * Calculate Sun position
 */
export async function calculateSunPosition(date = new Date()) {
  const sunData = await calculatePlanetPosition(Swisseph.SE_SUN, date);

  return {
    longitude: sunData.longitude,
    rashi_number: sunData.rashi_number,
    degrees_in_rashi: sunData.degrees_in_rashi,
    speed: sunData.speed
  };
}

/**
 * Calculate any planet by name
 */
export async function calculatePlanetByName(planetName, date = new Date()) {
  const planetConstants = {
    'sun': Swisseph.SE_SUN,
    'moon': Swisseph.SE_MOON,
    'mercury': Swisseph.SE_MERCURY,
    'venus': Swisseph.SE_VENUS,
    'mars': Swisseph.SE_MARS,
    'jupiter': Swisseph.SE_JUPITER,
    'saturn': Swisseph.SE_SATURN,
    'rahu': Swisseph.SE_TRUE_NODE,
    'ketu': Swisseph.SE_TRUE_NODE
  };

  const planetConstant = planetConstants[planetName.toLowerCase()];
  if (!planetConstant) {
    throw new Error(`Invalid planet name: ${planetName}`);
  }

  let result = await calculatePlanetPosition(planetConstant, date);

  // Special handling for Ketu (180° from Rahu)
  if (planetName.toLowerCase() === 'ketu') {
    result.longitude = normalize360(result.longitude + 180);
    result.rashi_number = Math.floor(result.longitude / 30);
    result.degrees_in_rashi = result.longitude % 30;
  }

  return result;
}

/**
 * Get current ayanamsa
 */
export function getAyanamsa(date = new Date()) {
  const julianDay = dateToJulianDay(date);
  return Swisseph.swe_get_ayanamsa_ut(julianDay);
}
```

### Step 2: Create API Routes

#### Main Calculation API

**File: `app/api/calculate/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { calculateMoonPosition, calculateSunPosition } from '@/app/lib/swisseph';

export const runtime = 'nodejs'; // Important: Use Node.js runtime

export async function POST(request) {
  try {
    const body = await request.json();
    const date = body.date ? new Date(body.date) : new Date();

    const [moonData, sunData] = await Promise.all([
      calculateMoonPosition(date),
      calculateSunPosition(date)
    ]);

    return NextResponse.json({
      success: true,
      timestamp: date.toISOString(),
      moon: moonData,
      sun: sunData
    });
  } catch (error) {
    console.error('Error calculating positions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST({ json: async () => ({}) });
}
```

#### Sun Times API (for Rahu Kalam)

**File: `app/api/sun-times/route.js`**

```javascript
import { NextResponse } from 'next/server';
import SunCalc from 'suncalc';

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude, date } = body;

    const targetDate = date ? new Date(date) : new Date();
    const times = SunCalc.getTimes(targetDate, latitude, longitude);

    return NextResponse.json({
      success: true,
      sunrise: times.sunrise,
      sunset: times.sunset,
      solarNoon: times.solarNoon,
      dawn: times.dawn,
      dusk: times.dusk
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

#### Planet Position API (Optional - for future expansion)

**File: `app/api/planet/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { calculatePlanetByName } from '@/app/lib/swisseph';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { planet, date } = body;

    if (!planet) {
      return NextResponse.json(
        { success: false, error: 'Planet name is required' },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();
    const planetData = await calculatePlanetByName(planet, targetDate);

    return NextResponse.json({
      success: true,
      planet: planet,
      timestamp: targetDate.toISOString(),
      data: planetData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Client-Side Data Fetching

### Create Custom Hook for Calculations

**File: `app/hooks/useAstroCalculations.js`**

```javascript
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAstroCalculations(refreshInterval = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString() })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result);
        setError(null);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching astro data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}
```

### Usage in Components

**Example: Updated NakshatraInfo.jsx**

```javascript
'use client';

import { useAstroCalculations } from '@/app/hooks/useAstroCalculations';
import { RASHI_ORDER, NAKSHATRA_ORDER } from '@/app/lib/vedic-constants';
import CosmicLoader from './CosmicLoader';
import { Alert } from './ui/alert';

export default function NakshatraInfo() {
  const { data, loading, error } = useAstroCalculations();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CosmicLoader />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <p>Error loading astronomical data: {error}</p>
      </Alert>
    );
  }

  if (!data?.moon) {
    return null;
  }

  const moonData = data.moon;
  const currentRashi = RASHI_ORDER[moonData.rashi_number];
  // ... rest of component logic stays exactly the same
}
```

---

## Cloudflare Deployment

### Step 1: Configure Next.js for Cloudflare

**File: `next.config.mjs`**

```javascript
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for pages that don't need SSR
  output: 'standalone',

  // Image optimization config for Cloudflare
  images: {
    unoptimized: true,
  },

  // Experimental features
  experimental: {
    runtime: 'experimental-edge',
  },
};

// Setup dev platform for local development
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
```

### Step 2: Add Wrangler Configuration

**File: `wrangler.toml`**

```toml
name = "vedic-astrology-dashboard"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[build]
command = "npm run build"

[observability]
enabled = true

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"  # Optional: for caching

[env.production]
routes = [
  { pattern = "yourdomain.com", custom_domain = true }
]
```

### Step 3: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "preview": "npm run build && wrangler pages dev .next",
    "deploy": "npm run build && wrangler pages deploy .next",
    "cf:build": "npx @opennextjs/cloudflare",
    "cf:deploy": "npm run cf:build && wrangler pages deploy"
  }
}
```

### Step 4: Deploy to Cloudflare

```bash
# First time setup
npm install -g wrangler
wrangler login

# Build with Cloudflare adapter
npm run cf:build

# Deploy
wrangler pages deploy .vercel/output/static

# Or use the npm script
npm run cf:deploy
```

### Step 5: Cloudflare Pages Dashboard Setup

1. Go to Cloudflare Dashboard → Pages
2. Create new project → Connect to Git
3. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run cf:build`
   - **Build output directory**: `.vercel/output/static`
   - **Environment variables**:
     - `NODE_VERSION`: `18` or higher
     - `NEXT_RUNTIME`: `nodejs`

4. Environment variables (if needed):
   ```
   NODE_ENV=production
   ```

5. Add custom domain (optional)

### Step 6: Enable Node.js Runtime

In your Cloudflare Pages project settings:
1. Go to Settings → Functions
2. Set **Compatibility Date**: `2024-09-23` or later
3. Enable **nodejs_compat** compatibility flag
4. Set **Runtime**: Node.js

---

## Testing & Validation

### Local Testing Checklist

```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Test API endpoints directly
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-01T12:00:00Z"}'

# 4. Check browser console for errors

# 5. Test all major features:
```

**Features to Test:**
- [ ] Moon position displays correctly
- [ ] Sun position displays correctly
- [ ] Chandrashtam calculations work
- [ ] Rahu Kalam displays
- [ ] Nakshatra info shows
- [ ] Time remaining in rashi is accurate
- [ ] Location selection works
- [ ] Notifications work (if implemented)
- [ ] PWA install prompt appears
- [ ] App works offline (service worker)
- [ ] Responsive design (mobile, tablet, desktop)

### Production Testing

After deploying to Cloudflare:

```bash
# Test API endpoint
curl -X POST https://your-domain.pages.dev/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-01T12:00:00Z"}'

# Check response time
time curl https://your-domain.pages.dev/api/calculate

# Test from different locations (use VPN or ask friends)
```

### Validation Tests

**File: `app/api/calculate/test.js` (create for testing)**

```javascript
import { calculateMoonPosition, calculateSunPosition } from '@/app/lib/swisseph';

export async function testCalculations() {
  const testDate = new Date('2024-01-01T12:00:00Z');

  console.log('Testing Swiss Ephemeris calculations...\n');

  const moon = await calculateMoonPosition(testDate);
  console.log('Moon Position:');
  console.log('  Longitude:', moon.longitude.toFixed(4), '°');
  console.log('  Rashi:', moon.rashi_number);
  console.log('  Degrees in Rashi:', moon.degrees_in_rashi.toFixed(4), '°');
  console.log('  Speed:', moon.speed.toFixed(4), '°/day');
  console.log('  Ayanamsa:', moon.ayanamsa.toFixed(4), '°\n');

  const sun = await calculateSunPosition(testDate);
  console.log('Sun Position:');
  console.log('  Longitude:', sun.longitude.toFixed(4), '°');
  console.log('  Rashi:', sun.rashi_number);
  console.log('  Degrees in Rashi:', sun.degrees_in_rashi.toFixed(4), '°');
  console.log('  Speed:', sun.speed.toFixed(4), '°/day');

  // Known values for validation (from Swiss Ephemeris reference)
  // Moon should be around 137.7° (Simha/Leo - Rashi 4)
  // Sun should be around 256.4° (Dhanu/Sagittarius - Rashi 8)

  return { moon, sun };
}
```

---

## PWA Configuration (Optional)

If you want to keep PWA features:

### Install next-pwa

```bash
npm install @ducanh2912/next-pwa
```

### Update next.config.mjs

```javascript
import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
  // ... your config
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
```

### Copy manifest.json to public/

```bash
cp public/manifest.json public/manifest.json
# Update paths if needed
```

---

## Environment Variables

### Development (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: For analytics, monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-id

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Production (Cloudflare)

Set in Cloudflare Pages dashboard:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.pages.dev
```

---

## Performance Optimization

### API Response Caching

**Update `app/api/calculate/route.js`:**

```javascript
import { NextResponse } from 'next/server';
import { calculateMoonPosition, calculateSunPosition } from '@/app/lib/swisseph';

// Cache for 1 minute
const cache = new Map();
const CACHE_DURATION = 60000;

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const date = body.date ? new Date(body.date) : new Date();

    // Round to minute for cache key
    const cacheKey = Math.floor(date.getTime() / CACHE_DURATION);

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json({
        ...cached,
        cached: true
      });
    }

    const [moonData, sunData] = await Promise.all([
      calculateMoonPosition(date),
      calculateSunPosition(date)
    ]);

    const result = {
      success: true,
      timestamp: date.toISOString(),
      moon: moonData,
      sun: sunData
    };

    // Store in cache
    cache.set(cacheKey, result);

    // Clean old cache entries
    if (cache.size > 10) {
      const oldestKey = Math.min(...cache.keys());
      cache.delete(oldestKey);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating positions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Component Code Splitting

Use dynamic imports for heavy components:

```javascript
import dynamic from 'next/dynamic';

const ChandrashtamAnnualView = dynamic(
  () => import('./components/ChandrashtamAnnualView'),
  { loading: () => <CosmicLoader /> }
);
```

---

## Rollback Plan

If something goes wrong, you can quickly rollback:

### Keep Your Current App

```bash
# Your current Vite app remains in:
~/vedic-astrology-dashboard/

# New Next.js app is in:
~/vedic-astrology-nextjs/

# Both can coexist and be deployed separately
```

### Quick Rollback Steps

1. **On Cloudflare:**
   - Go to Deployments tab
   - Click "Rollback" on previous deployment
   - Or point domain back to old deployment

2. **On Local:**
   ```bash
   cd ~/vedic-astrology-dashboard
   npm run dev
   # Your original app still works
   ```

3. **Git Branches:**
   ```bash
   # Keep main branch as-is
   # Create new branch for Next.js
   git checkout -b nextjs-migration
   # Work in that branch
   # Only merge to main when ready
   ```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module '@/app/...'"

**Solution:** Check `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue 2: "Dynamic require is not supported"

**Solution:** Make sure API routes have:
```javascript
export const runtime = 'nodejs';
```

### Issue 3: Swiss Ephemeris errors in browser

**Solution:** Swiss Ephemeris should ONLY be imported in:
- `app/lib/swisseph.js`
- `app/api/*/route.js` files

Never import in client components.

### Issue 4: Hydration errors

**Solution:** Add `'use client'` to components that use:
- `useState`
- `useEffect`
- Browser APIs
- Event handlers

### Issue 5: Build fails on Cloudflare

**Solution:**
1. Check `compatibility_date` is `2024-09-23` or later
2. Verify `nodejs_compat` flag is enabled
3. Check build logs for specific errors
4. Ensure `@opennextjs/cloudflare` is installed

---

## Cost Comparison

### Current (Vite + Cloudflare Pages)
- Free tier: Unlimited requests
- No functions/compute costs

### After (Next.js + Cloudflare Pages)
- Free tier: 100,000 requests/day
- Compute time: Included in free tier
- **Should still be FREE** for most personal/small projects

### When You'd Need to Pay
- 100K+ requests per day
- High compute time per request
- Need KV storage (caching)

For your Vedic astrology dashboard, **you'll likely stay on the free tier**.

---

## Migration Timeline

### Week 1: Setup & Foundation
- Day 1-2: Create Next.js project, copy files
- Day 3-4: Set up API routes, test calculations
- Day 5-7: Update components to use API

### Week 2: Testing & Refinement
- Day 1-3: Local testing, fix bugs
- Day 4-5: Deploy to Cloudflare staging
- Day 6-7: Production testing, monitoring

### Week 3: Launch
- Day 1-2: Final testing
- Day 3: Deploy to production
- Day 4-7: Monitor, fix any issues

**Total: 2-3 weeks** (working part-time)

---

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Swiss Ephemeris](https://www.astro.com/swisseph/)

### Example Projects
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [OpenNext Examples](https://github.com/opennextjs/opennextjs-cloudflare)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Cloudflare Discord](https://discord.gg/cloudflare)

---

## Final Checklist

Before going live:

### Development
- [ ] All components migrated
- [ ] All API routes working
- [ ] Swiss Ephemeris calculations verified
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Performance
- [ ] API response times < 500ms
- [ ] Initial page load < 3s
- [ ] Lighthouse score > 90
- [ ] No console errors

### Deployment
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured (optional)
- [ ] Error monitoring setup (optional)

### Documentation
- [ ] README updated
- [ ] API documentation written
- [ ] Component documentation
- [ ] Deployment guide for team

---

## Conclusion

This migration gives you:
- ✅ **Swiss Ephemeris** - Professional-grade calculations
- ✅ **Modern architecture** - Server + Client separation
- ✅ **Same deployment** - Still on Cloudflare
- ✅ **95% code reuse** - Minimal refactoring
- ✅ **Future-proof** - Easy to add features
- ✅ **Better performance** - Server-side caching
- ✅ **Cost-effective** - Still free tier

The migration is straightforward because most of your React code works as-is in Next.js. The main changes are moving calculations to API routes and updating components to fetch data.

**Good luck with your migration!** 🚀

---

## Questions?

If you encounter issues during migration:
1. Check this guide first
2. Review Next.js documentation
3. Check Cloudflare Pages docs
4. Search GitHub issues
5. Ask in Discord communities

Remember: You can always rollback to your current working Vite app if needed!
