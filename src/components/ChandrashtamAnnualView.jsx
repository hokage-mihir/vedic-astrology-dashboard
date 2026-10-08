import { useState, useMemo, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ImprovedTooltip } from './ui/improved-tooltip';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { RASHI_ORDER } from '../lib/vedic-constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import CosmicLoader from './CosmicLoader';

// Pre-calculated years (rolling 5-year window written by scripts/sync-chandrashtam-data.js
// before every build), loaded on demand
const yearModules = import.meta.glob('../data/chandrashtam-*.json', { import: 'default' });
const YEAR_LOADERS = Object.fromEntries(
  Object.entries(yearModules).map(([path, load]) => [Number(path.match(/(\d{4})\.json$/)[1]), load])
);
const CURRENT_YEAR = new Date().getFullYear();
// The current year is always offered; if the deployed build predates it, it's calculated in the browser
const AVAILABLE_YEARS = [...new Set([CURRENT_YEAR, ...Object.keys(YEAR_LOADERS).map(Number)])]
  .filter((y) => y >= CURRENT_YEAR)
  .sort((a, b) => a - b);

const loadYearData = async (year) => {
  if (YEAR_LOADERS[year]) return YEAR_LOADERS[year]();
  const { buildYearData } = await import('../lib/chandrashtam-calendar.js');
  return buildYearData(year);
};

const ChandrashtamAnnualView = ({ year, userRashi }) => {
  // Initialize with prop if available, otherwise default
  const [selectedRashi, setSelectedRashi] = useState(userRashi || 'Mesh');
  const [selectedYear, setSelectedYear] = useState(() => (AVAILABLE_YEARS.includes(year) ? year : CURRENT_YEAR));
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [chandrashtamData, setChandrashtamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Sync with prop changes (e.g. from context)
  useEffect(() => {
    if (userRashi) {
      setSelectedRashi(userRashi);
    }
  }, [userRashi]);

  // Load and process pre-calculated data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await loadYearData(selectedYear);

        if (!rawData) {
          console.error(`No data available for year ${selectedYear}`);
          setLoading(false);
          return;
        }

        // Convert ISO strings back to Date objects, keeping periods that overlap
        // the selected year in the viewer's timezone
        const yearStart = new Date(selectedYear, 0, 1);
        const yearEnd = new Date(selectedYear + 1, 0, 1);
        const converted = {};
        Object.keys(rawData.data).forEach(rashi => {
          converted[rashi] = rawData.data[rashi]
            .map(period => ({
              start: new Date(period.start),
              end: new Date(period.end),
              duration: period.duration
            }))
            .filter(period => period.end > yearStart && period.start < yearEnd);
        });

        setChandrashtamData({
          year: rawData.year,
          generatedAt: rawData.generatedAt,
          data: converted
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading pre-calculated data:', error);
        setChandrashtamData(null);
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  const periods = useMemo(() => chandrashtamData?.data[selectedRashi] || [], [chandrashtamData, selectedRashi]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (hours) => {
    if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = (hours % 24).toFixed(1);
    return `${days}d ${remainingHours}h`;
  };

  const getMonthName = (monthIndex) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  };

  // Group periods by month
  const periodsByMonth = useMemo(() => {
    const grouped = {};
    periods.forEach(period => {
      // A period that began in December of the previous year belongs to January
      const month = period.start.getFullYear() < selectedYear ? 0 : period.start.getMonth();
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(period);
    });
    return grouped;
  }, [periods, selectedYear]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <CosmicLoader text="Loading calendar data..." size={50} />
        </CardContent>
      </Card>
    );
  }

  if (!chandrashtamData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">
            No pre-calculated data available for {selectedYear}
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    totalPeriods: periods.length,
    totalHours: periods.reduce((sum, p) => sum + p.duration, 0),
    avgDuration: periods.length > 0 ? periods.reduce((sum, p) => sum + p.duration, 0) / periods.length : 0
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cosmic-purple-500" aria-label="Calendar icon" role="img" />
            <CardTitle className="text-lg md:text-xl">
              Chandrashtam Calendar
            </CardTitle>
            <ImprovedTooltip term="chandrashtam" />
          </div>
        </div>

        {/* Year and Rashi Selectors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cosmic-blue-500 focus:border-transparent"
            >
              {AVAILABLE_YEARS.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Rashi:
            </label>
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent"
            >
              {RASHI_ORDER.map(rashi => (
                <option key={rashi} value={rashi}>{rashi}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-cosmic-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-purple-600">
              {stats.totalPeriods}
            </div>
            <div className="text-xs text-gray-600">Total Periods</div>
          </div>
          <div className="bg-cosmic-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-blue-600">
              {Math.round(stats.totalHours / 24)}
            </div>
            <div className="text-xs text-gray-600">Total Days</div>
          </div>
          <div className="bg-cosmic-gold-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-gold-600">
              {formatDuration(stats.avgDuration)}
            </div>
            <div className="text-xs text-gray-600">Avg Duration</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.keys(periodsByMonth).sort((a, b) => a - b).map(month => (
            <div key={month} className="border-l-4 border-cosmic-purple-400 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {getMonthName(parseInt(month))} {selectedYear}
              </h3>
              <div className="space-y-2">
                {periodsByMonth[month].map((period, idx) => (
                  <motion.div
                    key={`${month}-${idx}`}
                    initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : {}}
                    animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : {}}
                    transition={!prefersReducedMotion ? { delay: idx * 0.05 } : { duration: 0 }}
                    className="bg-gray-50/50 rounded-lg p-3"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPeriod(expandedPeriod === `${month}-${idx}` ? null : `${month}-${idx}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(period.start)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(period.start)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Duration: {formatDuration(period.duration)}
                        </div>
                      </div>
                      {expandedPeriod === `${month}-${idx}` ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedPeriod === `${month}-${idx}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Start:</span>
                                <div className="font-medium text-gray-900">
                                  {formatDate(period.start)} at {formatTime(period.start)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">End:</span>
                                <div className="font-medium text-gray-900">
                                  {formatDate(period.end)} at {formatTime(period.end)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-amber-600">
                              ⚠️ Avoid important activities during this period
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Lahiri ayanamsa • Times shown in your device&apos;s timezone • Data generated {new Date(chandrashtamData.generatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

ChandrashtamAnnualView.propTypes = {
  year: PropTypes.number,
  userRashi: PropTypes.string
};

export default memo(ChandrashtamAnnualView);
