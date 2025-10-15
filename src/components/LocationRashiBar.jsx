import { useState, useEffect } from 'react';
import { MapPin, Moon, CheckCircle, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { RASHI_ORDER, CHANDRASHTAM_MAP } from '../lib/vedic-constants';
import { RASHI_SYMBOLS } from '../lib/rashi-symbols';

const LOCATIONS = [
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Varanasi', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
];

const LocationRashiBar = ({ onLocationChange, currentMoonRashi }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : LOCATIONS[0];
  });

  const [selectedRashi, setSelectedRashi] = useState(() => {
    const saved = localStorage.getItem('userMoonRashi');
    return saved || RASHI_ORDER[0];
  });

  useEffect(() => {
    localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    onLocationChange(selectedLocation);
  }, [selectedLocation, onLocationChange]);

  useEffect(() => {
    localStorage.setItem('userMoonRashi', selectedRashi);
  }, [selectedRashi]);

  const handleLocationChange = (e) => {
    const location = LOCATIONS.find(loc => loc.name === e.target.value);
    setSelectedLocation(location);
  };

  const handleRashiChange = (e) => {
    setSelectedRashi(e.target.value);
  };

  // Check if selected Rashi is currently afflicted
  const afflictingMoonPosition = CHANDRASHTAM_MAP[selectedRashi];
  const isAfflicted = afflictingMoonPosition === currentMoonRashi;

  // Check if user's Rashi is coming up next (1 Rashi before affliction)
  const currentMoonIndex = RASHI_ORDER.indexOf(currentMoonRashi);
  const nextMoonRashi = RASHI_ORDER[(currentMoonIndex + 1) % 12];
  const afflictingNextMoonPosition = CHANDRASHTAM_MAP[selectedRashi];
  const isUpcomingAffliction = afflictingNextMoonPosition === nextMoonRashi;

  const getStatusConfig = () => {
    if (isAfflicted) {
      return {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        text: 'Chandrashtam Active',
        subText: 'Be mindful',
        pulse: true
      };
    } else if (isUpcomingAffliction) {
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        text: 'Coming Soon',
        subText: 'Next ~2.5 days',
        pulse: false
      };
    } else {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        text: 'Clear',
        subText: 'Good time!',
        pulse: false
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-3">
      {/* Instructional Header */}
      <div className="text-center md:text-left">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          ⚙️ Personalize Your Experience
        </h3>
        <p className="text-xs text-gray-600">
          Select your location and Moon sign to get personalized alerts
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Location Selector */}
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            Your Location
          </label>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-cosmic-purple-200 hover:border-cosmic-purple-400 transition-colors">
            <MapPin className="w-5 h-5 text-cosmic-purple-500 flex-shrink-0" aria-label="Location icon" role="img" />
            <select
              value={selectedLocation.name}
              onChange={handleLocationChange}
              className="bg-transparent border-none outline-none text-gray-900 font-medium cursor-pointer w-full"
              aria-label="Select location"
            >
              {LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rashi Selector */}
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            Your Moon Sign (Rashi)
          </label>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-cosmic-blue-200 hover:border-cosmic-blue-400 transition-colors">
            <Moon className="w-5 h-5 text-cosmic-blue-500 flex-shrink-0" aria-label="Moon icon" role="img" />
            <select
              value={selectedRashi}
              onChange={handleRashiChange}
              className="bg-transparent border-none outline-none text-gray-900 font-medium cursor-pointer w-full"
              aria-label="Select your moon sign"
            >
              {RASHI_ORDER.map(rashi => (
                <option key={rashi} value={rashi}>
                  {RASHI_SYMBOLS[rashi]} {rashi}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Indicator with Explanation */}
        <div className="flex-shrink-0">
          <label className="text-xs font-semibold text-gray-700 mb-1 block">
            Your Current Status
          </label>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 ${status.borderColor} ${status.bgColor} ${
              status.pulse ? 'animate-pulse' : ''
            } min-w-[140px] justify-center`}
          >
            <StatusIcon className={`w-5 h-5 ${status.color}`} aria-label="Status icon" role="img" />
            <div className="text-center">
              <div className={`font-bold ${status.color} text-sm whitespace-nowrap`}>
                {status.text}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {status.subText}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

LocationRashiBar.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
  currentMoonRashi: PropTypes.string.isRequired,
};

export { LocationRashiBar, LOCATIONS };
