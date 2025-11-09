import { useEffect } from 'react';

/**
 * Custom hook for managing dynamic SEO meta tags
 */
export const useSEO = (config) => {
  useEffect(() => {
    // Update page title
    if (config.title) {
      document.title = config.title;
    }

    // Update or create meta description
    const updateMetaTag = (name, content, property = null) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    if (config.description) {
      updateMetaTag('description', config.description);
    }
    
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Update Open Graph tags
    if (config.ogTitle) {
      updateMetaTag('og:title', config.ogTitle, 'og:title');
    }
    
    if (config.ogDescription) {
      updateMetaTag('og:description', config.ogDescription, 'og:description');
    }
    
    if (config.ogImage) {
      updateMetaTag('og:image', config.ogImage, 'og:image');
    }

    // Update Twitter Card tags
    if (config.twitterTitle) {
      updateMetaTag('twitter:title', config.twitterTitle, 'twitter:title');
    }
    
    if (config.twitterDescription) {
      updateMetaTag('twitter:description', config.twitterDescription, 'twitter:description');
    }

    // Update canonical URL
    if (config.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', config.canonical);
    }

    // Cleanup function (optional)
    return () => {
      // Reset to default values if needed
    };
  }, [config]);
};

// SEO configurations for different views
export const SEO_CONFIGS = {
  simplified: {
    title: 'Moon Mood - Personal Chandrashtam Status | Vedic Astrology',
    description: 'Check your personal Chandrashtam status instantly. Real-time Moon position tracking for your Rashi with personalized cosmic insights.',
    keywords: 'Chandrashtam status, personal astrology, Moon position, Rashi check, Vedic astrology app',
    ogTitle: 'Personal Chandrashtam Status - Moon Mood',
    ogDescription: 'Get instant updates on your Chandrashtam periods and cosmic influences with our personalized Vedic astrology dashboard.',
    canonical: 'https://moonmood.xyz/?view=simplified'
  },
  advanced: {
    title: 'Moon Mood - Advanced Vedic Astrology Dashboard | Complete Panchang',
    description: 'Complete Vedic astrology dashboard with Chandrashtam calculator, Nakshatra tracking, Panchang details, and annual astrology calendar.',
    keywords: 'Vedic astrology dashboard, Panchang, Nakshatra, Rahu Kalam, astrology calculator, Moon phases',
    ogTitle: 'Advanced Vedic Astrology Dashboard - Moon Mood',
    ogDescription: 'Comprehensive Vedic astrology tools including real-time calculations, annual calendar, and detailed cosmic insights.',
    canonical: 'https://moonmood.xyz/?view=advanced'
  },
  calendar: {
    title: 'Annual Chandrashtam Calendar 2025 | Complete Vedic Astrology Planner',
    description: 'View complete Chandrashtam calendar for 2025. Plan your year with detailed astrological timing for all 12 Rashis.',
    keywords: 'Chandrashtam calendar 2025, Vedic astrology planner, annual Rashi timing, astrology calendar',
    ogTitle: 'Annual Chandrashtam Calendar 2025 - Moon Mood',
    ogDescription: 'Plan your year with our comprehensive Chandrashtam calendar showing all periods for every Rashi in 2025.',
    canonical: 'https://moonmood.xyz/?view=advanced#annual-calendar'
  }
};