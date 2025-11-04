import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { getChandrashtamStatus, calculatePreciseDaysUntilChandrashtam, formatTimeRemaining, calculateProgress } from '../lib/chandrashtam-calculator.js';
import { calculateMoonPosition } from '../lib/astro-calculator.js';
import { RASHI_ORDER } from '../lib/vedic-constants.js';
import { ImprovedTooltip } from './ui/improved-tooltip';

export function PersonalStatusCard({ userRashi, location, compact = false, defaultExpanded = false }) {
  const [moonData, setMoonData] = useState(null);
  const [status, setStatus] = useState(null);
  const [timeUntil, setTimeUntil] = useState(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (!userRashi) return;

    const updateStatus = () => {
      const moonPos = calculateMoonPosition();
      if (moonPos) {
        setMoonData(moonPos);

        const currentRashi = RASHI_ORDER[moonPos.rashi_number];
        const chandrashtamStatus = getChandrashtamStatus(userRashi, currentRashi, moonPos);
        setStatus(chandrashtamStatus);

        const timeData = calculatePreciseDaysUntilChandrashtam(userRashi, moonPos);
        setTimeUntil(timeData);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [userRashi]);

  if (!userRashi) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
      >
        <div className="text-center text-gray-500">
          <Info className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-base sm:text-lg font-medium px-2">Select your Rashi to see your Chandrashtam status</p>
          <p className="text-xs sm:text-sm mt-2">Your Moon sign determines your Chandrashtam periods</p>
        </div>
      </motion.div>
    );
  }

  if (!status) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-purple-600 mx-auto"></div>
          <p className="text-sm sm:text-base text-gray-500 mt-3">Calculating your Chandrashtam status...</p>
        </div>
      </motion.div>
    );
  }

  const getStatusIcon = () => {
    switch (status.color) {
      case 'green':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'yellow':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case 'red':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Info className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusBgColor = () => {
    switch (status.color) {
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = () => {
    switch (status.color) {
      case 'green':
        return 'text-green-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'red':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const progress = timeUntil ? calculateProgress(timeUntil) : 0;

  // Compact collapsed view for mobile
  if (compact && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl shadow-lg p-4 border-2 ${getStatusBgColor()} cursor-pointer`}
        onClick={() => setIsExpanded(true)}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <h2 className={`text-sm font-bold ${getStatusTextColor()}`}>
                Chandrashtam Status
              </h2>
              <p className={`text-xs ${getStatusTextColor()} opacity-75`}>
                {userRashi} Rashi
              </p>
            </div>
          </div>
          <ImprovedTooltip term="chandrashtam" />
        </div>

        {/* Status Badge */}
        <div className="text-center mb-3">
          <motion.div
            className={`text-base font-bold mb-1 ${getStatusTextColor()}`}
            animate={status.color === 'red' ? { scale: [1, 1.05, 1] } : {}}
            transition={status.color === 'red' ? { repeat: Infinity, duration: 2 } : {}}
          >
            {status.title}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Clock className={`w-3.5 h-3.5 ${getStatusTextColor()}`} />
              <p className={`text-xs ${getStatusTextColor()} opacity-75`}>
                {status.color === 'red' ? 'Ends in' : status.color === 'yellow' ? 'Starts in' : 'Next in'}
              </p>
            </div>
            <p className={`text-sm font-bold ${getStatusTextColor()}`}>
              {timeUntil ? formatTimeRemaining(timeUntil.days, timeUntil.hours) : '...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                status.color === 'red' ? 'bg-red-600' :
                status.color === 'yellow' ? 'bg-yellow-600' :
                'bg-green-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Expand Button */}
        <button
          className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
            status.color === 'red' ? 'bg-red-100 hover:bg-red-200 text-red-700' :
            status.color === 'yellow' ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' :
            'bg-green-100 hover:bg-green-200 text-green-700'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <span>View Details</span>
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
      transition={{ duration: 0.5 }}
      className={`rounded-xl shadow-lg ${compact ? 'p-4' : 'p-4 sm:p-5 md:p-6'} border-2 ${getStatusBgColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {getStatusIcon()}
          <div className="min-w-0 flex-1">
            <h2 className={`text-base sm:text-lg md:text-xl font-bold ${getStatusTextColor()}`}>
              Your Chandrashtam Status
            </h2>
            <p className={`text-xs sm:text-sm ${getStatusTextColor()} opacity-75`}>
              for {userRashi} Rashi
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <ImprovedTooltip term="chandrashtam" />
        </div>
      </div>

      {/* Status Title */}
      <div className="text-center mb-4 sm:mb-6">
        <motion.h3
          className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 px-2 ${getStatusTextColor()}`}
          animate={status.color === 'red' ? { scale: [1, 1.05, 1] } : {}}
          transition={status.color === 'red' ? { repeat: Infinity, duration: 2 } : {}}
        >
          {status.title}
        </motion.h3>
        <p className={`text-xs sm:text-sm ${getStatusTextColor()} opacity-90 px-2`}>
          {status.message}
        </p>
      </div>

      {/* Progress Ring and Timer */}
      <div className="flex flex-col items-center mb-4 sm:mb-6">
        <ProgressRing
          progress={progress}
          size={140}
          strokeWidth={10}
          statusColor={status.color}
          label={status.color === 'red' ? 'Time Remaining' : status.color === 'yellow' ? 'Coming Soon' : 'Time Until'}
          subLabel={timeUntil ? formatTimeRemaining(timeUntil.days, timeUntil.hours) : ''}
        />

        {timeUntil && status.color !== 'red' && (
          <div className="mt-3 sm:mt-4 text-center">
            <p className={`text-xs sm:text-sm font-medium ${getStatusTextColor()}`}>
              {status.color === 'green' ? 'Next Chandrashtam in:' : 'Starts in:'}
            </p>
            <p className={`text-base sm:text-lg font-bold ${getStatusTextColor()}`}>
              {formatTimeRemaining(timeUntil.days, timeUntil.hours)}
            </p>
          </div>
        )}

        {timeUntil && status.color === 'red' && (
          <div className="mt-3 sm:mt-4 text-center">
            <p className={`text-xs sm:text-sm font-medium ${getStatusTextColor()}`}>
              Ends in:
            </p>
            <p className={`text-base sm:text-lg font-bold ${getStatusTextColor()}`}>
              {formatTimeRemaining(timeUntil.days, timeUntil.hours)}
            </p>
          </div>
        )}
      </div>

      {/* Guidance */}
      {status.guidance && (
        <div className="border-t pt-3 sm:pt-4">
          <h4 className={`text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${getStatusTextColor()}`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Guidance & Recommendations:
          </h4>
          <ul className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${getStatusTextColor()} opacity-90`}>
            {status.guidance.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 sm:mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Location Info */}
      {location && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Calculations based on {location.name} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
          </p>
        </div>
      )}

      {/* Collapse Button (only in compact mode) */}
      {compact && (
        <button
          className={`w-full mt-4 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${
            status.color === 'red' ? 'bg-red-100 hover:bg-red-200 text-red-700' :
            status.color === 'yellow' ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' :
            'bg-green-100 hover:bg-green-200 text-green-700'
          }`}
          onClick={() => setIsExpanded(false)}
        >
          <span>Collapse</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}

PersonalStatusCard.propTypes = {
  userRashi: PropTypes.string,
  location: PropTypes.shape({
    name: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    timezone: PropTypes.string
  }),
  compact: PropTypes.bool,
  defaultExpanded: PropTypes.bool
};

export default PersonalStatusCard;