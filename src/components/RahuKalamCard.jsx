import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, X, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { getRahuKalamForDay, getZonedDateKey, formatTime as formatTimeInZone, getTimeZoneLabel, isDifferentTimeZone } from '../lib/sun-calculator.js';
import { ImprovedTooltip } from './ui/improved-tooltip';
import { trackEvent } from '../services/analytics';

export function RahuKalamCard({ location, compact = false, defaultExpanded = false }) {
  const [now, setNow] = useState(() => new Date());
  const [showNextDays, setShowNextDays] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Tick every minute so "active" state and the day rollover stay current
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeZone = location?.timezone;
  // Changes only when the calendar day changes at the selected location
  const dayKey = location ? getZonedDateKey(now, timeZone) : null;

  const { rahuKalam, tomorrow, nextDaysData } = useMemo(() => {
    if (!location) return { rahuKalam: null, tomorrow: null, nextDaysData: [] };
    const base = new Date();
    const days = [];
    for (let i = 1; i <= 6; i++) {
      days.push(getRahuKalamForDay(location, base, i));
    }
    return { rahuKalam: getRahuKalamForDay(location, base, 0), tomorrow: days[0], nextDaysData: days };
    // dayKey drives recomputation at the location's midnight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dayKey]);

  const formatTime = (date) => (date ? formatTimeInZone(date, timeZone) : '');

  const formatRange = (timing) =>
    timing?.start && timing?.end ? `${formatTime(timing.start)} - ${formatTime(timing.end)}` : 'Unable to calculate';

  const formatDayLabel = (date, options) =>
    date.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });

  const formatTimeRange = () => formatRange(rahuKalam);

  const showZoneLabel = timeZone && isDifferentTimeZone(timeZone, now);
  const locationLabel = location
    ? `${location.name}${showZoneLabel ? ` · ${getTimeZoneLabel(timeZone, now)}` : ''}`
    : 'Default Location';

  const phase = !rahuKalam?.start || !rahuKalam?.end
    ? 'unknown'
    : now < rahuKalam.start ? 'upcoming' : now <= rahuKalam.end ? 'active' : 'over';

  if (!rahuKalam) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cosmic-purple-600 mx-auto"></div>
          <p className="text-sm sm:text-base text-gray-500 mt-3">Calculating Rahu Kalam timing...</p>
        </div>
      </motion.div>
    );
  }

  const isActive = phase === 'active';
  const phaseLabel = { active: '⚠️ Active now', upcoming: 'Later today', over: 'Over for today', unknown: 'Today' }[phase];

  // Compact collapsed view for mobile
  if (compact && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`rounded-xl shadow-lg p-4 border-2 cursor-pointer ${
          isActive
            ? 'bg-red-50 border-red-200'
            : 'bg-orange-50 border-orange-200'
        }`}
        onClick={() => setIsExpanded(true)}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`p-1.5 rounded-full flex-shrink-0 ${
              isActive ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${
                isActive ? 'text-red-600' : 'text-orange-600'
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-sm font-bold ${
                isActive ? 'text-red-700' : 'text-orange-700'
              }`}>
                Rahu Kalam
              </h3>
              <p className={`text-xs ${
                isActive ? 'text-red-600' : 'text-orange-600'
              }`}>
                {phaseLabel}
              </p>
            </div>
          </div>
          <ImprovedTooltip term="rahuKalam" />
        </div>

        {/* Time Display */}
        <div className="text-center mb-3">
          <div className={`text-lg font-bold ${
            isActive ? 'text-red-700' : 'text-orange-700'
          }`}>
            {formatTimeRange()}
          </div>
          <p className={`text-xs mt-1 ${
            isActive ? 'text-red-600' : 'text-orange-600'
          }`}>
            {locationLabel}
          </p>
          {phase === 'over' && tomorrow && (
            <p className="text-xs mt-1 text-orange-700 font-medium">
              Tomorrow: {formatRange(tomorrow)}
            </p>
          )}
        </div>

        {/* Expand Button */}
        <button
          className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
            isActive
              ? 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <span>View Guidance</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    );
  }

  // Full expanded view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-xl shadow-lg ${compact ? 'p-4' : 'p-4 sm:p-5 md:p-6'} border-2 ${
        isActive
          ? 'bg-red-50 border-red-200'
          : 'bg-orange-50 border-orange-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
            isActive ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isActive ? 'text-red-600' : 'text-orange-600'
            }`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg font-bold ${
              isActive ? 'text-red-700' : 'text-orange-700'
            }`}>
              Today&apos;s Rahu Kalam
            </h3>
            <p className={`text-xs sm:text-sm ${
              isActive ? 'text-red-600' : 'text-orange-600'
            }`}>
              {phaseLabel}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <ImprovedTooltip term="rahuKalam" />
        </div>
      </div>

      {/* Time Display */}
      <div className={`text-center mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${
        isActive
          ? 'bg-red-100 border border-red-200'
          : 'bg-orange-100 border border-orange-200'
      }`}>
        <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
          isActive ? 'text-red-700' : 'text-orange-700'
        }`}>
          {formatTimeRange()}
        </div>
        <p className={`text-xs sm:text-sm mt-1 ${
          isActive ? 'text-red-600' : 'text-orange-600'
        }`}>
          {locationLabel}
        </p>
        {phase === 'over' && tomorrow && (
          <p className="text-xs sm:text-sm mt-1 text-orange-700 font-medium">
            Tomorrow: {formatRange(tomorrow)}
          </p>
        )}
      </div>

      {/* Guidance */}
      <div className="space-y-3 sm:space-y-4">
        {/* Avoid Section */}
        <div>
          <h4 className={`text-sm sm:text-base font-semibold mb-2 flex items-center gap-2 ${
            isActive ? 'text-red-700' : 'text-orange-700'
          }`}>
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Avoid during this period:
          </h4>
          <ul className={`text-xs sm:text-sm space-y-1 ${
            isActive ? 'text-red-600' : 'text-orange-600'
          }`}>
            <li>• Starting important activities</li>
            <li>• Making major decisions</li>
            <li>• Beginning new projects</li>
            <li>• Financial transactions</li>
            <li>• Travel or journeys</li>
          </ul>
        </div>

        {/* Good For Section */}
        <div>
          <h4 className={`text-sm sm:text-base font-semibold mb-2 flex items-center gap-2 ${
            isActive ? 'text-red-700' : 'text-orange-700'
          }`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ✨ Good time for:
          </h4>
          <ul className={`text-xs sm:text-sm space-y-1 ${
            isActive ? 'text-red-600' : 'text-orange-600'
          }`}>
            <li>• Meditation and introspection</li>
            <li>• Chanting mantras</li>
          </ul>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Rahu Kalam is one-eighth of the daytime (sunrise to sunset), so its length changes with the season and your location. It is ruled by Rahu (North Node of the Moon).
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Calculated from sunrise and sunset at {location?.name || 'your location'}
          {location ? ` (${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°)` : ''}
          {timeZone ? `, shown in ${getTimeZoneLabel(timeZone, now)}` : ''}.
        </p>
      </div>

      {/* Next 6 Days Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setShowNextDays(!showNextDays);
            if (!showNextDays) {
              trackEvent('Rahu Kalam', 'view_next_days', '6_day_forecast');
            }
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
            isActive
              ? 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>{showNextDays ? 'Hide' : 'Show'} Next 6 Days</span>
          {showNextDays ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Next Days Display */}
      {showNextDays && nextDaysData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-3"
        >
          {nextDaysData.map((dayData) => (
            <div
              key={dayData.labelDate.toISOString()}
              className={`p-3 rounded-lg border ${
                isActive
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`font-semibold text-sm ${
                    isActive ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {formatDayLabel(dayData.labelDate, { weekday: 'long' })}
                  </p>
                  <p className={`text-xs ${
                    isActive ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {formatDayLabel(dayData.labelDate, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    isActive ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {formatRange(dayData)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Collapse Button (only in compact mode) */}
      {compact && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
              isActive
                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
            }`}
            onClick={() => setIsExpanded(false)}
          >
            <span>Collapse</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

RahuKalamCard.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    timezone: PropTypes.string
  }),
  compact: PropTypes.bool,
  defaultExpanded: PropTypes.bool
};

export default RahuKalamCard;