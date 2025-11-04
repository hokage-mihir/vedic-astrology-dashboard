import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-R4LJBLR6RF';
const DEBUG = import.meta.env.DEV;

let isInitialized = false;

/**
 * Initialize Google Analytics 4
 * Only initializes once and respects user consent
 */
export const initializeAnalytics = () => {
  // Check if user has given consent
  const consent = localStorage.getItem('analyticsConsent');

  if (consent !== 'accepted') {
    if (DEBUG) {
      console.log('[Analytics] Waiting for user consent');
    }
    return false;
  }

  if (isInitialized) {
    if (DEBUG) {
      console.log('[Analytics] Already initialized');
    }
    return true;
  }

  try {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true,
        cookieFlags: 'SameSite=None;Secure'
      },
      gtagOptions: {
        send_page_view: false // We'll manually track page views
      }
    });

    isInitialized = true;

    if (DEBUG) {
      console.log('[Analytics] Initialized successfully');
    }

    return true;
  } catch (error) {
    console.error('[Analytics] Initialization failed:', error);
    return false;
  }
};

/**
 * Track page views
 */
export const trackPageView = (path, title) => {
  if (!isInitialized) return;

  if (DEBUG) {
    console.log('[Analytics] Page View:', { path, title });
  }

  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title
  });
};

/**
 * Track custom events
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (!isInitialized) {
    if (DEBUG) {
      console.log('[Analytics] Event (not sent - not initialized):', { category, action, label, value });
    }
    return;
  }

  if (DEBUG) {
    console.log('[Analytics] Event:', { category, action, label, value });
  }

  const eventParams = {
    category,
    action,
  };

  if (label !== null) {
    eventParams.label = label;
  }

  if (value !== null) {
    eventParams.value = value;
  }

  ReactGA.event(eventParams);
};

/**
 * Track with custom dimensions (for Vedic astrology context)
 */
export const trackWithDimensions = (eventName, dimensions = {}) => {
  if (!isInitialized) {
    if (DEBUG) {
      console.log('[Analytics] Custom Event (not sent):', { eventName, dimensions });
    }
    return;
  }

  if (DEBUG) {
    console.log('[Analytics] Custom Event:', { eventName, dimensions });
  }

  ReactGA.gtag('event', eventName, dimensions);
};

/**
 * Set user properties (like birth rashi)
 */
export const setUserProperties = (properties) => {
  if (!isInitialized) return;

  if (DEBUG) {
    console.log('[Analytics] User Properties:', properties);
  }

  ReactGA.gtag('set', 'user_properties', properties);
};

/**
 * Check if analytics is initialized
 */
export const isAnalyticsInitialized = () => isInitialized;

/**
 * Enable analytics after user consent
 */
export const enableAnalytics = () => {
  localStorage.setItem('analyticsConsent', 'accepted');
  return initializeAnalytics();
};

/**
 * Disable analytics and clear consent
 */
export const disableAnalytics = () => {
  localStorage.setItem('analyticsConsent', 'rejected');
  isInitialized = false;

  if (DEBUG) {
    console.log('[Analytics] Disabled by user');
  }
};
