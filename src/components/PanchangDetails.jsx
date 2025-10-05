import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { InfoTooltip } from "../components/ui/tooltip";
import { calculateMoonPosition, calculateSunPosition } from '../lib/astro-calculator';
import { RASHI_ORDER, TITHI_NAMES } from '../lib/vedic-constants';
import { calculateSunTimes, formatTime, calculateRahuKalam } from '../lib/sun-calculator';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Calendar, Sun, Moon, AlertCircle, Clock, Sunrise, Sunset, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicLoader from './CosmicLoader';

const formatGregorianDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const PanchangDetails = ({ location }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const prefersReducedMotion = useReducedMotion();

  // Helper to check if selected date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper to get start of day for a date
  const getStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Navigate to previous day (min: today)
  const handlePreviousDay = () => {
    const today = getStartOfDay(new Date());
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    if (prevDay >= today) {
      setSelectedDate(prevDay);
    }
  };

  // Navigate to next day (max: today + 4 days)
  const handleNextDay = () => {
    const maxDate = getStartOfDay(new Date());
    maxDate.setDate(maxDate.getDate() + 4);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStart = getStartOfDay(nextDay);
    if (nextDayStart <= maxDate) {
      setSelectedDate(nextDay);
    }
  };

  // Jump to today
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const calculateTithiEndTime = (moonPos, sunPos, baseDate) => {
    try {
      if (!moonPos || !sunPos) return null;

      const moonLong = moonPos.longitude;
      const sunLong = sunPos.longitude;
      let distance = moonLong - sunLong;
      if (distance < 0) distance += 360;

      const currentTithiStartDegree = Math.floor(distance / 12) * 12;
      const degreesToNextTithi = (currentTithiStartDegree + 12) - distance;

      // Use speed from positions
      const relativeSpeed = Math.abs(moonPos.speed - sunPos.speed);
      if (relativeSpeed === 0) return null; // Avoid division by zero

      const hoursToNextTithi = (degreesToNextTithi / relativeSpeed) * 24;

      const endTime = new Date(baseDate.getTime() + hoursToNextTithi * 60 * 60 * 1000);

      return {
        time: endTime,
        hours: hoursToNextTithi
      };
    } catch (err) {
      console.error('Error calculating tithi end time:', err);
      return null;
    }
  };
  
  const calculateTithi = (moonPos, sunPos, baseDate) => {
    try {
      if (!moonPos || !sunPos) throw new Error('Invalid position data');

      const moonLong = moonPos.longitude;
      const sunLong = sunPos.longitude;

      let distance = moonLong - sunLong;
      if (distance < 0) distance += 360;

      // Tithi calculation: each Tithi represents 12° of separation
      const tithiNumber = Math.floor(distance / 12);
      const paksha = tithiNumber >= 15 ? 'Krishna' : 'Shukla';
      const tithiIndex = tithiNumber % 15;

      let tithiName = TITHI_NAMES[tithiIndex];
      if (tithiIndex === 14) {
        tithiName = paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
      }

      // Calculate end time only if we have valid positions
      const endTimeInfo = calculateTithiEndTime(moonPos, sunPos, baseDate);

      return {
        name: tithiName,
        number: tithiIndex + 1,
        paksha: paksha,
        degrees: distance % 12,
        endTime: endTimeInfo?.time,
        hoursToEnd: endTimeInfo?.hours
      };
    } catch (err) {
      console.error('Error calculating tithi:', err);
      throw new Error('Tithi calculation failed');
    }
  };
  useEffect(() => {
    const updateDetails = () => {
      try {
        setLoading(true);
        const moonPos = calculateMoonPosition(selectedDate);
        const sunPos = calculateSunPosition(selectedDate);

        if (!moonPos || !sunPos) {
          throw new Error('Failed to calculate positions');
        }

        // Calculate real sunrise/sunset using suncalc
        const sunTimes = calculateSunTimes(location, selectedDate);

        // Calculate Rahu Kalam based on real sunrise/sunset
        const rahuKalam = calculateRahuKalam(sunTimes.sunrise, sunTimes.sunset);

        const tithiDetails = calculateTithi(moonPos, sunPos, selectedDate);

        setDetails({
          gregorianDate: formatGregorianDate(selectedDate),
          moonPosition: {
            rashi: RASHI_ORDER[moonPos.rashi_number],
            degrees: moonPos.degrees_in_rashi.toFixed(2)
          },
          sunPosition: {
            rashi: RASHI_ORDER[sunPos.rashi_number],
            degrees: sunPos.degrees_in_rashi.toFixed(2)
          },
          tithi: tithiDetails,
          muhurtas: {
            brahma: "4:24 AM - 5:12 AM",
            abhijeet: "11:48 AM - 12:36 PM"
          },
          rahuKalam: rahuKalam.start && rahuKalam.end
            ? `${formatTime(rahuKalam.start)} - ${formatTime(rahuKalam.end)}`
            : 'Not available',
          timings: {
            sunrise: formatTime(sunTimes.sunrise),
            sunset: formatTime(sunTimes.sunset)
          }
        });

        setError(null);
      } catch (err) {
        console.error('Error updating details:', err);
        setError('Failed to calculate astronomical details');
      } finally {
        setLoading(false);
      }
    };

    updateDetails();

    // Only auto-refresh if viewing today
    let interval;
    if (isToday(selectedDate)) {
      interval = setInterval(updateDetails, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [location, selectedDate]);

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.3 } : { duration: 0 }}
    >
      <Card className="bg-white border-cosmic-gold-200 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cosmic-gold-500" aria-label="Calendar icon" role="img" />
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
              Daily Vedic Details
            </CardTitle>
            <InfoTooltip
              content="Panchang provides essential Vedic calendar information including planetary positions, lunar day (Tithi), and auspicious timings"
              side="right"
            />
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <button
              onClick={handlePreviousDay}
              disabled={isToday(selectedDate)}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-2">
              {!isToday(selectedDate) && (
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-xs font-medium bg-cosmic-gold-100 text-cosmic-gold-700 rounded-lg hover:bg-cosmic-gold-200 transition-colors"
                >
                  Today
                </button>
              )}
              {!loading && !error && details && (
                <motion.div
                  className="text-sm text-gray-700 font-medium text-center"
                  initial={!prefersReducedMotion ? { opacity: 0 } : {}}
                  animate={!prefersReducedMotion ? { opacity: 1 } : {}}
                  transition={!prefersReducedMotion ? { delay: 0.2 } : { duration: 0 }}
                >
                  {details.gregorianDate}
                </motion.div>
              )}
            </div>

            <button
              onClick={handleNextDay}
              disabled={(() => {
                const maxDate = getStartOfDay(new Date());
                maxDate.setDate(maxDate.getDate() + 4);
                return getStartOfDay(selectedDate) >= maxDate;
              })()}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <CosmicLoader text="Calculating details..." size={50} />}

          {error && (
            <motion.div
              className="text-center p-4 text-red-600"
              initial={!prefersReducedMotion ? { opacity: 0 } : {}}
              animate={!prefersReducedMotion ? { opacity: 1 } : {}}
              transition={{ duration: 0 }}
            >
              <AlertCircle className="w-8 h-8 mx-auto mb-2" aria-label="Error icon" role="img" />
              {error}
            </motion.div>
          )}

          {!loading && !error && details && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={!prefersReducedMotion ? { opacity: 0 } : {}}
              animate={!prefersReducedMotion ? { opacity: 1 } : {}}
              transition={!prefersReducedMotion ? { delay: 0.2 } : { duration: 0 }}
            >
              {/* Left Column */}
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-br from-cosmic-blue-50 to-white rounded-lg border border-cosmic-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-cosmic-blue-500" aria-label="Moon icon" role="img" />
                    <span className="font-semibold text-gray-900 text-sm">Moon Position</span>
                    <InfoTooltip content="Current sidereal zodiac position of the Moon" side="top" />
                  </div>
                  <p className="text-lg font-semibold text-cosmic-blue-600">
                    {details.moonPosition.rashi} ({details.moonPosition.degrees}°)
                  </p>
                </div>

                <div className="p-3 bg-gradient-to-br from-cosmic-gold-50 to-white rounded-lg border border-cosmic-gold-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-cosmic-gold-500" aria-label="Sun icon" role="img" />
                    <span className="font-semibold text-gray-900 text-sm">Sun Position</span>
                    <InfoTooltip content="Current sidereal zodiac position of the Sun" side="top" />
                  </div>
                  <p className="text-lg font-semibold text-cosmic-gold-600">
                    {details.sunPosition.rashi} ({details.sunPosition.degrees}°)
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-cosmic-purple-500" aria-label="Calendar icon" role="img" />
                    <span className="font-semibold text-gray-900 text-sm">Tithi</span>
                    <InfoTooltip content="Lunar day in Vedic calendar, based on Moon-Sun angular distance" side="top" />
                  </div>
                  <p className="text-base text-gray-900 font-medium">
                    {details.tithi.name} ({details.tithi.number}) - {details.tithi.paksha}
                  </p>
                  {details.tithi.endTime && (
                    <div className="mt-2 text-xs text-gray-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-label="Clock icon" role="img" />
                      <span>
                        Changes at: {details.tithi.endTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {details.tithi.hoursToEnd < 24 && (
                          <span className="ml-1">
                            (in {Math.floor(details.tithi.hoursToEnd)}h {Math.floor((details.tithi.hoursToEnd % 1) * 60)}m)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Timings ({location.name})</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Sunrise className="w-4 h-4 text-orange-500" aria-label="Sunrise icon" role="img" />
                      <span>Sunrise: {details.timings.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Sunset className="w-4 h-4 text-indigo-500" aria-label="Sunset icon" role="img" />
                      <span>Sunset: {details.timings.sunset}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border-2 border-red-300">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" aria-label="Alert icon" role="img" />
                    <span className="font-semibold text-red-600">
                      Rahu Kalam
                    </span>
                    <InfoTooltip
                      content="Inauspicious time period ruled by Rahu. Best to avoid important activities during this time."
                      side="left"
                    />
                  </div>
                  <p className="text-sm text-red-700 font-medium">
                    {details.rahuKalam}
                  </p>
                  <p className="text-xs text-red-600/70 mt-1">
                    (calculated for {location.name})
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-green-600" aria-label="Clock icon" role="img" />
                    <span className="font-semibold text-gray-900">Auspicious Muhurtas</span>
                    <InfoTooltip
                      content="Most favorable time periods for important activities and spiritual practices"
                      side="left"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Brahma Muhurta:</span>
                      <p className="text-green-700">{details.muhurtas.brahma}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Abhijeet Muhurta:</span>
                      <p className="text-green-700">{details.muhurtas.abhijeet}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

PanchangDetails.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired,
};

export default memo(PanchangDetails);