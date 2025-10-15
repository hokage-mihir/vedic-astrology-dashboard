import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { RASHI_ORDER, CHANDRASHTAM_MAP } from '../lib/vedic-constants';
import { RASHI_SYMBOLS } from '../lib/rashi-symbols';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const RashiStatusCard = ({ currentMoonRashi }) => {
  const [selectedRashi, setSelectedRashi] = useState(RASHI_ORDER[0]);

  // Check if selected Rashi is currently afflicted
  const afflictingMoonPosition = CHANDRASHTAM_MAP[selectedRashi];
  const isAfflicted = afflictingMoonPosition === currentMoonRashi;

  const getStatusConfig = () => {
    if (isAfflicted) {
      return {
        icon: AlertTriangle,
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-700',
        iconColor: 'text-red-600',
        title: '⚠️ Chandrashtam Active',
        message: `${selectedRashi} is experiencing Chandrashtam right now. Practice mindfulness and patience.`,
        pulse: true
      };
    } else {
      return {
        icon: CheckCircle,
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-700',
        iconColor: 'text-green-600',
        title: '✓ Clear Period',
        message: `${selectedRashi} is not affected by Chandrashtam right now. Good time for activities!`,
        pulse: false
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <Card className={`${status.bgColor} border-2 ${status.borderColor} transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cosmic-purple-500" aria-label="Info icon" role="img" />
          <CardTitle className="text-lg font-bold text-gray-900">
            Check Your Rashi Status
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rashi Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Your Moon Sign (Rashi):
          </label>
          <select
            value={selectedRashi}
            onChange={(e) => setSelectedRashi(e.target.value)}
            className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent"
          >
            {RASHI_ORDER.map(rashi => (
              <option key={rashi} value={rashi}>
                {RASHI_SYMBOLS[rashi]} {rashi}
              </option>
            ))}
          </select>
        </div>

        {/* Status Display */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-lg border-2 ${status.borderColor} ${status.bgColor} ${
            status.pulse ? 'animate-pulse' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <StatusIcon
              className={`w-6 h-6 ${status.iconColor} flex-shrink-0 mt-0.5`}
              aria-label="Status icon"
              role="img"
            />
            <div>
              <h3 className={`font-bold ${status.textColor} mb-1`}>
                {status.title}
              </h3>
              <p className={`text-sm ${status.textColor}`}>
                {status.message}
              </p>
              {isAfflicted && (
                <p className="text-xs text-red-600 mt-2 italic">
                  Moon is currently in {RASHI_SYMBOLS[currentMoonRashi]} {currentMoonRashi}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

RashiStatusCard.propTypes = {
  currentMoonRashi: PropTypes.string.isRequired,
};

export default RashiStatusCard;
