import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

// Educational content for astrological terms
const TOOLTIPS = {
  chandrashtam: {
    title: "Chandrashtam",
    subtitle: "Moon Affliction Period",
    content: "When the Moon transits the 8th house from your birth Moon sign, it may bring emotional challenges and reduced mental clarity. Typically lasts ~2.25 days each month.",
    emoji: "⚠️"
  },
  nakshatra: {
    title: "Nakshatra",
    subtitle: "Lunar Mansion",
    content: "The 27 sectors along the Moon's path. Each has specific qualities, ruling deities, and influences on personality and life events.",
    emoji: "⭐"
  },
  rashi: {
    title: "Rashi",
    subtitle: "Zodiac Sign",
    content: "The 12 signs of the zodiac in Vedic astrology, each spanning 30°. Your Moon Rashi influences your emotional nature and mind.",
    emoji: "♈"
  },
  tithi: {
    title: "Tithi",
    subtitle: "Lunar Day",
    content: "One phase of the Moon cycle. There are 30 Tithis in a lunar month, each with specific energies suitable for different activities.",
    emoji: "🌙"
  },
  rahuKalam: {
    title: "Rahu Kalam",
    subtitle: "Inauspicious Period",
    content: "A daily ~90 minute period ruled by Rahu (shadow planet). Best to avoid starting important activities during this time.",
    emoji: "🚫"
  },
  muhurta: {
    title: "Muhurta",
    subtitle: "Auspicious Time",
    content: "Favorable time periods for important activities and spiritual practices, based on planetary positions.",
    emoji: "✨"
  },
  moonPhase: {
    title: "Moon Phase",
    subtitle: "Lunar Illumination",
    content: "The visible portion of the Moon. Each phase (New, Waxing, Full, Waning) affects emotions and activities differently.",
    emoji: "🌒"
  }
};

export function ImprovedTooltip({ term, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const tooltip = TOOLTIPS[term];

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  if (!tooltip) {
    console.warn(`Tooltip not found for term: ${term}`);
    return null;
  }

  const tooltipContent = isVisible && position.top > 0 && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -5 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed pointer-events-none w-72"
      style={{
        top: `${position.top - 12}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999
      }}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden w-full">
        {/* Header with emoji */}
        <div className="bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl flex-shrink-0">{tooltip.emoji}</span>
            <div className="min-w-0">
              <h4 className="font-bold text-sm leading-tight">
                {tooltip.title}
              </h4>
              <p className="text-xs text-white/80">
                {tooltip.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2.5">
          <p className="text-xs leading-relaxed text-gray-100">
            {tooltip.content}
          </p>
        </div>

        {/* Arrow */}
        <div className="absolute w-3 h-3 bg-gray-900 rotate-45 bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b border-gray-700" />
      </div>
    </motion.div>
  );

  return (
    <>
      <div className={`relative inline-flex ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
          className="focus:outline-none focus:ring-2 focus:ring-cosmic-blue-400 rounded-full"
          aria-label={`Learn more about ${tooltip.title}`}
        >
          <Info
            className="w-4 h-4 text-cosmic-blue-500 hover:text-cosmic-blue-700 transition-colors cursor-help"
          />
        </button>
      </div>
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>{tooltipContent}</AnimatePresence>,
        document.body
      )}
    </>
  );
}

ImprovedTooltip.propTypes = {
  term: PropTypes.oneOf(Object.keys(TOOLTIPS)).isRequired,
  className: PropTypes.string,
};

export { TOOLTIPS };
