import { useState } from 'react';
import { Info } from 'lucide-react';
import PropTypes from 'prop-types';

// Educational content for astrological terms
const TOOLTIPS = {
  chandrashtam: {
    title: "Chandrashtam (Moon Affliction)",
    content: "When the Moon transits the 8th house from your birth Moon sign. This period may bring emotional challenges, obstacles, and reduced mental clarity. It typically lasts ~2.25 days each month."
  },
  nakshatra: {
    title: "Nakshatra (Lunar Mansion)",
    content: "The 27 sectors along the ecliptic that the Moon passes through. Each Nakshatra has specific qualities, ruling deities, and influences on personality and life events."
  },
  rashi: {
    title: "Rashi (Zodiac Sign)",
    content: "The 12 signs of the zodiac in Vedic astrology, each spanning 30°. Your Moon Rashi is determined by the Moon's position at birth and influences your emotional nature."
  },
  tithi: {
    title: "Tithi (Lunar Day)",
    content: "One phase of the Moon, representing the angle between the Sun and Moon. There are 30 Tithis in a lunar month, each with specific energies suitable for different activities."
  },
  yoga: {
    title: "Yoga (Astral Combination)",
    content: "The angular relationship between the Sun and Moon. There are 27 Yogas that influence the quality of time and the success of endeavors."
  },
  karana: {
    title: "Karana (Half Lunar Day)",
    content: "Half of a Tithi, representing more precise timing. There are 11 Karanas that determine the auspiciousness of specific periods."
  },
  sunrise: {
    title: "Sunrise Time",
    content: "The moment the upper edge of the Sun appears above the horizon. In Vedic astrology, this marks the beginning of the day and influences daily planetary periods."
  },
  sunset: {
    title: "Sunset Time",
    content: "The moment the upper edge of the Sun disappears below the horizon. This marks the end of the day and the beginning of night planetary influences."
  },
  moonPhase: {
    title: "Moon Phase",
    content: "The illuminated portion of the Moon as seen from Earth. Each phase (New, Waxing, Full, Waning) carries specific energies affecting emotions and activities."
  },
  ayanamsa: {
    title: "Ayanamsa",
    content: "The difference between tropical and sidereal zodiacs. Lahiri Ayanamsa is most commonly used, aligning the zodiac with actual star positions for accurate calculations."
  },
  rahuKalam: {
    title: "Rahu Kalam",
    content: "An inauspicious time period ruled by Rahu (North Node of Moon). Occurs daily for ~90 minutes when Rahu's influence is strongest. Best to avoid important activities during this time."
  },
  muhurta: {
    title: "Muhurta (Auspicious Time)",
    content: "Favorable time periods for important activities and spiritual practices. Based on planetary positions and lunar phases, these times enhance the success of endeavors."
  }
};

export function InfoTooltip({ term, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltip = TOOLTIPS[term];

  if (!tooltip) {
    console.warn(`Tooltip not found for term: ${term}`);
    return null;
  }

  // Always use Info icon to match calendar style
  const Icon = Info;

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        <Icon 
          className="w-4 h-4 text-blue-500 cursor-help hover:text-blue-600 transition-colors" 
          aria-label={`Learn more about ${tooltip.title}`}
        />
      </div>
      
      {isVisible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs break-words animate-in fade-in-0 zoom-in-95 bottom-full left-1/2 -translate-x-1/2 mb-2"
        >
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h4 className="font-semibold mb-1">
              {tooltip.title}
            </h4>
            <p className="text-xs leading-relaxed opacity-90">
              {tooltip.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

InfoTooltip.propTypes = {
  term: PropTypes.oneOf(Object.keys(TOOLTIPS)).isRequired,
  className: PropTypes.string,
};

export { TOOLTIPS };