/**
 * Per-route SEO metadata. Used at runtime by useSEO and at build time by the
 * Vite plugin that writes a static HTML file for each non-root route, so
 * crawlers see the right title/canonical before any JavaScript runs.
 */
export const SITE_URL = 'https://moonmood.xyz';

export const ROUTE_SEO = {
  '/': {
    title: 'Moon Mood - Vedic Astrology Dashboard | Chandrashtam Calculator & Panchang',
    description: 'Check your personal Chandrashtam status instantly with real-time Moon tracking (Lahiri ayanamsa), plus today\'s Rahu Kalam for your city.',
    canonical: `${SITE_URL}/`,
  },
  '/advanced': {
    title: 'Advanced Vedic Astrology Dashboard - Panchang, Nakshatra & Chandrashtam Calendar | Moon Mood',
    description: 'Live Chandrashtam calculator, Nakshatra and Tithi, sunrise-based Rahu Kalam and a full annual Chandrashtam calendar for all 12 Rashis, using Lahiri ayanamsa.',
    canonical: `${SITE_URL}/advanced`,
  },
};

/** Static file name emitted for each non-root route (Cloudflare Pages serves /advanced from advanced.html). */
export const ROUTE_HTML_FILES = {
  '/advanced': 'advanced.html',
};
