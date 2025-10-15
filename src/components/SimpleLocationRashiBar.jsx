import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapPin, Moon, ChevronDown, Search } from 'lucide-react';
import { RASHI_ORDER } from '../lib/vedic-constants.js';
import { RASHI_SYMBOLS } from '../lib/rashi-symbols.js';
import LOCATIONS from '../data/locations';

export function SimpleLocationRashiBar({ onLocationChange, onRashiChange }) {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : LOCATIONS[0]; // Default to first location (Accra alphabetically)
  });

  const [selectedRashi, setSelectedRashi] = useState(() => {
    const saved = localStorage.getItem('selectedRashi');
    return saved || '';
  });

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isRashiOpen, setIsRashiOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    if (onLocationChange) {
      onLocationChange(selectedLocation);
    }
  }, [selectedLocation, onLocationChange]);

  useEffect(() => {
    localStorage.setItem('selectedRashi', selectedRashi);
    if (onRashiChange) {
      onRashiChange(selectedRashi);
    }
  }, [selectedRashi, onRashiChange]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
    setLocationSearch('');
  };

  const handleRashiSelect = (rashi) => {
    setSelectedRashi(rashi);
    setIsRashiOpen(false);
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isLocationOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isLocationOpen]);

  // Filter locations based on search
  const filteredLocations = LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    (location.country && location.country.toLowerCase().includes(locationSearch.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Location Selector */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Location (Current or Closest Available)
          </label>
          <div className="relative">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent transition-colors flex items-center justify-between"
            >
              <div className="text-left min-w-0 flex-1">
                <span className="font-medium text-sm sm:text-base text-gray-900 block truncate">{selectedLocation.name}</span>
                <p className="text-xs text-gray-500 mt-0.5">Select your current city or nearest location</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLocationOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                {/* Search Input */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-2 sm:p-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Search city or country..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location List */}
                <div className="max-h-40 sm:max-h-52 overflow-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleLocationSelect(city)}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 text-left hover:bg-cosmic-purple-50 focus:bg-cosmic-purple-50 focus:outline-none transition-colors ${
                          selectedLocation.name === city.name ? 'bg-cosmic-purple-100 text-cosmic-purple-700' : 'text-gray-900'
                        }`}
                      >
                        <div className="text-sm sm:text-base font-medium">{city.name}{city.country && <span className="text-xs ml-2 text-gray-500">({city.country})</span>}</div>
                        <div className="text-xs text-gray-500">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 sm:px-4 py-4 text-center text-sm text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rashi Selector */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Your Rashi (Moon Sign)
          </label>
          <div className="relative">
            <button
              onClick={() => setIsRashiOpen(!isRashiOpen)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent transition-colors flex items-center justify-between"
            >
              <span className="font-medium text-sm sm:text-base text-gray-900">
                {selectedRashi ? `${RASHI_SYMBOLS[selectedRashi]} ${selectedRashi}` : 'Select your Rashi'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isRashiOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRashiOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                {RASHI_ORDER.map((rashi) => (
                  <button
                    key={rashi}
                    onClick={() => handleRashiSelect(rashi)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 text-left hover:bg-cosmic-purple-50 focus:bg-cosmic-purple-50 focus:outline-none transition-colors flex items-center gap-2 sm:gap-3 ${
                      selectedRashi === rashi ? 'bg-cosmic-purple-100 text-cosmic-purple-700' : 'text-gray-900'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{RASHI_SYMBOLS[rashi]}</span>
                    <span className="font-medium text-sm sm:text-base">{rashi}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-4 sm:mt-4 md:mt-4 p-2.5 sm:p-3 bg-cosmic-purple-50 rounded-lg border border-cosmic-purple-200">
        <p className="text-xs sm:text-sm text-cosmic-purple-700">
          <strong>Why your Rashi matters:</strong> Your Moon sign (Rashi) determines when Chandrashtam periods affect you.
          Each Rashi experiences Chandrashtam when the Moon transits the 8th house from it.
        </p>
      </div>
    </motion.div>
  );
}

SimpleLocationRashiBar.propTypes = {
  onLocationChange: PropTypes.func,
  onRashiChange: PropTypes.func
};

export default SimpleLocationRashiBar;