import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, X, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { calculateRahuKalam, calculateSunTimes } from '../lib/sun-calculator.js';
import { ImprovedTooltip } from './ui/improved-tooltip';
import { trackEvent } from '../services/analytics';

export function RahuKalamCard({ location, date = new Date() }) {
  const [rahuKalam, setRahuKalam] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNextDays, setShowNextDays] = useState(false);
  const [nextDaysData, setNextDaysData] = useState([]);

  useEffect(() => {
    if (!location) return;

    const calculateRahuKalamTiming = () => {
      try {
        // Calculate sunrise and sunset times
        const sunTimes = calculateSunTimes(location, date);
        
        if (sunTimes && sunTimes.sunrise && sunTimes.sunset) {
          const timing = calculateRahuKalam(sunTimes.sunrise, sunTimes.sunset, date.getDay());
          setRahuKalam(timing);
        } else {
          setRahuKalam({ start: null, end: null });
        }
      } catch (error) {
        console.error('Error calculating Rahu Kalam:', error);
        setRahuKalam({ start: null, end: null });
      }
    };

    calculateRahuKalamTiming();

    // Calculate next 6 days' Rahu Kalam
    const calculateNextDays = () => {
      const days = [];
      for (let i = 1; i <= 6; i++) {
        const futureDate = new Date(date);
        futureDate.setDate(date.getDate() + i);

        try {
          const sunTimes = calculateSunTimes(location, futureDate);
          if (sunTimes && sunTimes.sunrise && sunTimes.sunset) {
            const timing = calculateRahuKalam(sunTimes.sunrise, sunTimes.sunset, futureDate.getDay());
            days.push({
              date: futureDate,
              dayName: futureDate.toLocaleDateString('en-US', { weekday: 'long' }),
              dateStr: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              timing
            });
          }
        } catch (error) {
          console.error(`Error calculating Rahu Kalam for day ${i}:`, error);
        }
      }
      setNextDaysData(days);
    };

    calculateNextDays();

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [location, date]);

  const isRahuKalamActive = () => {
    if (!rahuKalam || !rahuKalam.start || !rahuKalam.end) return false;

    const now = currentTime.getTime();
    const startTime = rahuKalam.start.getTime();
    const endTime = rahuKalam.end.getTime();

    return now >= startTime && now <= endTime;
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = () => {
    if (!rahuKalam || !rahuKalam.start || !rahuKalam.end) {
      return 'Unable to calculate';
    }
    return `${formatTime(rahuKalam.start)} - ${formatTime(rahuKalam.end)}`;
  };

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

  const isActive = isRahuKalamActive();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border-2 ${
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
              Today's Rahu Kalam
            </h3>
            <p className={`text-xs sm:text-sm ${
              isActive ? 'text-red-600' : 'text-orange-600'
            }`}>
              {isActive ? '⚠️ ACTIVE NOW' : 'Scheduled for today'}
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
          {location?.name || 'Default Location'}
        </p>
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
          Rahu Kalam is an inauspicious 90-minute period ruled by Rahu (North Node of Moon)
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
          {nextDaysData.map((dayData, index) => (
            <div
              key={index}
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
                    {dayData.dayName}
                  </p>
                  <p className={`text-xs ${
                    isActive ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {dayData.dateStr}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    isActive ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {dayData.timing.start && dayData.timing.end
                      ? `${formatTime(dayData.timing.start)} - ${formatTime(dayData.timing.end)}`
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
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
  date: PropTypes.instanceOf(Date)
};

export default RahuKalamCard;