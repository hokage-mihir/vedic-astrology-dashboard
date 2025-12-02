import React, { createContext, useContext, useState, useEffect } from 'react';
import LOCATIONS from '../data/locations';
import { RASHI_ORDER } from '../lib/vedic-constants';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  // Initialize location from localStorage or default to first location
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedLocation');
      return saved ? JSON.parse(saved) : LOCATIONS[0];
    } catch (e) {
      console.error('Error parsing saved location:', e);
      return LOCATIONS[0];
    }
  });

  // Initialize Rashi from localStorage or default to first Rashi
  const [selectedRashi, setSelectedRashi] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedRashi');
      // Fallback for legacy key 'userMoonRashi' if 'selectedRashi' is missing
      const legacySaved = localStorage.getItem('userMoonRashi');
      return saved || legacySaved || RASHI_ORDER[0];
    } catch (e) {
      console.error('Error parsing saved rashi:', e);
      return RASHI_ORDER[0];
    }
  });

  // Persist location changes
  useEffect(() => {
    localStorage.setItem('selectedLocation', JSON.stringify(currentLocation));
  }, [currentLocation]);

  // Persist Rashi changes
  useEffect(() => {
    localStorage.setItem('selectedRashi', selectedRashi);
    // Keep legacy key in sync for now to avoid breaking other components reading it directly
    localStorage.setItem('userMoonRashi', selectedRashi);
  }, [selectedRashi]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
  };

  const updateRashi = (rashi) => {
    setSelectedRashi(rashi);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        selectedRashi,
        updateLocation,
        updateRashi
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
