import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapPin, Moon, ChevronDown, Search } from 'lucide-react';
import { RASHI_ORDER } from '../lib/vedic-constants.js';
import { RASHI_SYMBOLS } from '../lib/rashi-symbols.js';
import LOCATIONS from '../data/locations';
import { BottomSheet } from './ui/BottomSheet';

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

  // Focus search input when bottom sheet opens
  useEffect(() => {
    if (isLocationOpen && searchInputRef.current) {
      // Delay to allow bottom sheet animation to complete
      setTimeout(() => searchInputRef.current?.focus(), 300);
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
      className="bg-white rounded-xl shadow-lg p-3 border border-gray-200"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Location Selector */}
        <button
          onClick={() => setIsLocationOpen(true)}
          className="px-3 py-2.5 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600">Location</span>
          </div>
          <div className="font-medium text-sm text-gray-900 truncate">
            {selectedLocation.name}
          </div>
        </button>

          {/* Location Bottom Sheet */}
          <BottomSheet
            isOpen={isLocationOpen}
            onClose={() => {
              setIsLocationOpen(false);
              setLocationSearch('');
            }}
            title="Select Location"
            maxHeight={85}
          >
            {/* Search Input */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search city or country..."
                  className="w-full pl-11 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location List */}
            <div className="p-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleLocationSelect(city)}
                    className={`w-full px-4 py-3.5 mb-1 text-left rounded-lg hover:bg-cosmic-purple-50 active:bg-cosmic-purple-100 focus:bg-cosmic-purple-50 focus:outline-none transition-colors ${
                      selectedLocation.name === city.name ? 'bg-cosmic-purple-100 text-cosmic-purple-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="text-base font-medium">
                      {city.name}
                      {city.country && <span className="text-sm ml-2 text-gray-500">({city.country})</span>}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-base text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          </BottomSheet>

        {/* Rashi Selector */}
        <button
          onClick={() => setIsRashiOpen(true)}
          className="px-3 py-2.5 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cosmic-purple-500 focus:border-transparent transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <Moon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600">Rashi</span>
          </div>
          <div className="font-medium text-sm text-gray-900 truncate">
            {selectedRashi ? `${RASHI_SYMBOLS[selectedRashi]} ${selectedRashi}` : 'Select Rashi'}
          </div>
        </button>

        {/* Rashi Bottom Sheet */}
        <BottomSheet
          isOpen={isRashiOpen}
          onClose={() => setIsRashiOpen(false)}
          title="Select Your Rashi"
          maxHeight={75}
        >
          <div className="p-2">
            {RASHI_ORDER.map((rashi) => (
              <button
                key={rashi}
                onClick={() => handleRashiSelect(rashi)}
                className={`w-full px-4 py-3.5 mb-1 text-left rounded-lg hover:bg-cosmic-purple-50 active:bg-cosmic-purple-100 focus:bg-cosmic-purple-50 focus:outline-none transition-colors flex items-center gap-3 ${
                  selectedRashi === rashi ? 'bg-cosmic-purple-100 text-cosmic-purple-700' : 'text-gray-900'
                }`}
              >
                <span className="text-2xl">{RASHI_SYMBOLS[rashi]}</span>
                <span className="font-medium text-base">{rashi}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </motion.div>
  );
}

SimpleLocationRashiBar.propTypes = {
  onLocationChange: PropTypes.func,
  onRashiChange: PropTypes.func
};

export default SimpleLocationRashiBar;