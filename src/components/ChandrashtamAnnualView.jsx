import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { InfoTooltip } from './ui/tooltip';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { RASHI_ORDER } from '../lib/vedic-constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import CosmicLoader from './CosmicLoader';

// Import the data directly
import chandrashtamData2025 from '../data/chandrashtam-2025.json';
import chandrashtamData2026 from '../data/chandrashtam-2026.json';
import chandrashtamData2027 from '../data/chandrashtam-2027.json';
import chandrashtamData2028 from '../data/chandrashtam-2028.json';
import chandrashtamData2029 from '../data/chandrashtam-2029.json';

const DATA_MAP = {
  2025: chandrashtamData2025,
  2026: chandrashtamData2026,
  2027: chandrashtamData2027,
  2028: chandrashtamData2028,
  2029: chandrashtamData2029,
};

const ChandrashtamAnnualView = ({ year = 2025 }) => {
  const [selectedRashi, setSelectedRashi] = useState('Mesh');
  const [selectedYear, setSelectedYear] = useState(year);
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [chandrashtamData, setChandrashtamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Available years
  const availableYears = Object.keys(DATA_MAP).map(Number).sort();

  // Load and process pre-calculated data
  useEffect(() => {
    try {
      const rawData = DATA_MAP[selectedYear];

      if (!rawData) {
        console.error(`No data available for year ${selectedYear}`);
        setLoading(false);
        return;
      }

      // Convert ISO strings back to Date objects
      const converted = {};
      Object.keys(rawData.data).forEach(rashi => {
        converted[rashi] = rawData.data[rashi].map(period => ({
          start: new Date(period.start),
          end: new Date(period.end),
          duration: period.duration,
          incomplete: period.incomplete
        }));
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
  }, [selectedYear]);

  const periods = chandrashtamData?.data[selectedRashi] || [];

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
      const month = period.start.getMonth();
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(period);
    });
    return grouped;
  }, [periods]);

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
          <p className="text-center text-gray-600 dark:text-gray-400">
            No pre-calculated data available for {year}
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
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cosmic-purple-500" aria-label="Calendar icon" role="img" />
            <CardTitle className="text-lg md:text-xl">
              Chandrashtam Calendar
            </CardTitle>
            <InfoTooltip
              content="Pre-calculated Chandrashtam periods for the entire year. Select your Rashi to see all afflicted days."
              side="right"
            />
          </div>
        </div>

        {/* Year and Rashi Selectors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cosmic-blue-500 focus:border-transparent"
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Your Rashi:
            </label>
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent"
            >
              {RASHI_ORDER.map(rashi => (
                <option key={rashi} value={rashi}>{rashi}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-cosmic-purple-50 dark:bg-cosmic-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-purple-600 dark:text-cosmic-purple-400">
              {stats.totalPeriods}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Periods</div>
          </div>
          <div className="bg-cosmic-blue-50 dark:bg-cosmic-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-blue-600 dark:text-cosmic-blue-400">
              {Math.round(stats.totalHours / 24)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Days</div>
          </div>
          <div className="bg-cosmic-gold-50 dark:bg-cosmic-gold-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cosmic-gold-600 dark:text-cosmic-gold-400">
              {formatDuration(stats.avgDuration)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Duration</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.keys(periodsByMonth).sort((a, b) => a - b).map(month => (
            <div key={month} className="border-l-4 border-cosmic-purple-400 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {getMonthName(parseInt(month))} {selectedYear}
              </h3>
              <div className="space-y-2">
                {periodsByMonth[month].map((period, idx) => (
                  <motion.div
                    key={`${month}-${idx}`}
                    initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : {}}
                    animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : {}}
                    transition={!prefersReducedMotion ? { delay: idx * 0.05 } : { duration: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPeriod(expandedPeriod === `${month}-${idx}` ? null : `${month}-${idx}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(period.start)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(period.start)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Start:</span>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(period.start)} at {formatTime(period.start)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">End:</span>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(period.end)} at {formatTime(period.end)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
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

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Data generated: {new Date(chandrashtamData.generatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

ChandrashtamAnnualView.propTypes = {
  year: PropTypes.number
};

export default ChandrashtamAnnualView;
