import { useEffect } from 'react';
import { ROUTE_SEO } from '../lib/seo-config';

const setMeta = (attr, key, content) => {
  let meta = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

/**
 * Keep the document head in sync with the current route on client-side
 * navigation (the initial HTML for each route already has these values).
 * @param {string} path - Route path key in ROUTE_SEO, e.g. '/advanced'
 */
export const useSEO = (path) => {
  useEffect(() => {
    const config = ROUTE_SEO[path];
    if (!config) return;

    document.title = config.title;
    setMeta('name', 'description', config.description);
    setMeta('property', 'og:title', config.title);
    setMeta('property', 'og:description', config.description);
    setMeta('property', 'og:url', config.canonical);
    setMeta('name', 'twitter:title', config.title);
    setMeta('name', 'twitter:description', config.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', config.canonical);
  }, [path]);
};
