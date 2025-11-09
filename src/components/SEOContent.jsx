import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SEOContent = () => {
  const prefersReducedMotion = useReducedMotion();

  const astrologyFeatures = [
    {
      title: "Chandrashtam Calculator",
      description: "Real-time tracking of Moon's 8th house transit periods. Get instant alerts when Chandrashtam starts or ends for your Rashi.",
      keywords: ["Chandrashtam", "Moon transit", "8th house", "Rashi timing"]
    },
    {
      title: "Nakshatra Tracking",
      description: "Monitor current Nakshatra position with detailed information about ruling deity, symbol, and planetary influence.",
      keywords: ["Nakshatra", "lunar mansion", "birth star", "Vedic astrology"]
    },
    {
      title: "Panchang Details",
      description: "Complete daily Panchang including Tithi, Vara, Nakshatra, Yoga, and Karana with accurate sunrise/sunset timings.",
      keywords: ["Panchang", "Hindu calendar", "Tithi", "auspicious times"]
    },
    {
      title: "Rahu Kalam Calculator",
      description: "Daily Rahu Kalam timings for your location. Avoid starting important activities during these inauspicious periods.",
      keywords: ["Rahu Kalam", "inauspicious time", "bad timing", "astrology warnings"]
    }
  ];

  const rashiInfo = [
    "Mesh (Aries)", "Vrishab (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischik (Scorpio)",
    "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbha (Aquarius)", "Meen (Pisces)"
  ];

  return (
    <section className="mt-12 space-y-8" aria-labelledby="seo-content-heading">
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
        className="text-center"
      >
        <h2 id="seo-content-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Complete Vedic Astrology Solution
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Moon Mood provides comprehensive Vedic astrology calculations based on ancient Indian astronomical principles. 
          Our app uses precise algorithms to track celestial movements and their influence on human consciousness.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {astrologyFeatures.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
            animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={!prefersReducedMotion ? { duration: 0.5, delay: index * 0.1 } : { duration: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-700 mb-3">
              {feature.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {feature.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Rashi Information */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.6, delay: 0.4 } : { duration: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          All 12 Rashis (Zodiac Signs) Supported
        </h3>
        <p className="text-gray-700 mb-4">
          Get personalized Chandrashtam calculations for all Vedic moon signs. Each Rashi has specific periods 
          when the Moon's position creates challenging cosmic influences.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rashiInfo.map((rashi) => (
            <div
              key={rashi}
              className="px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg text-center"
            >
              <span className="text-sm font-medium text-gray-800">{rashi}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Educational Content */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.6, delay: 0.5 } : { duration: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Understanding Vedic Astrology
        </h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>Vedic astrology</strong>, also known as <strong>Jyotish</strong>, is an ancient Indian system of 
            astronomy and astrology that dates back thousands of years. Unlike Western astrology, Vedic astrology uses 
            the <strong>sidereal zodiac</strong>, which accounts for the precession of equinoxes and provides more 
            accurate calculations of planetary positions.
          </p>
          <p className="text-gray-700 mb-4">
            The <strong>Moon</strong> plays a central role in Vedic astrology, governing emotions, consciousness, and 
            mental well-being. <strong>Chandrashtam</strong> occurs when the Moon transits the 8th house from your 
            birth Moon sign (Janma Rashi), creating a period of potential challenges that requires awareness and 
            conscious navigation.
          </p>
          <p className="text-gray-700">
            Our app combines traditional Vedic knowledge with modern technology to provide you with accurate, 
            real-time astrological insights that help you make informed decisions and navigate cosmic influences 
            with greater awareness.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default SEOContent;